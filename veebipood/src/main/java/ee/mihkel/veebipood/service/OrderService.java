package ee.mihkel.veebipood.service;

import ee.mihkel.veebipood.entity.Order;
import ee.mihkel.veebipood.entity.PaymentState;
import ee.mihkel.veebipood.entity.Person;
import ee.mihkel.veebipood.entity.Product;
import ee.mihkel.veebipood.model.PaymentStatus;
import ee.mihkel.veebipood.model.everypay.EveryPayBody;
import ee.mihkel.veebipood.model.everypay.EveryPayLink;
import ee.mihkel.veebipood.model.everypay.EveryPayResponse;
import ee.mihkel.veebipood.model.everypay.EveryPayStatus;
import ee.mihkel.veebipood.repository.OrderRepository;
import ee.mihkel.veebipood.repository.PersonRepository;
import ee.mihkel.veebipood.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    PersonRepository personRepository;

    @Value("${everypay.url}")
    String url;

    @Value("${everypay.username}")
    String username;

    @Value("${everypay.password}")
    String password;

    @Value("${everypay.customerUrl}")
    String customerUrl;

    public EveryPayLink saveOrder(List<Product> products, String parcelMachine) {
        Order order = new Order();
        order.setCreated(new Date());
        order.setProducts(products);

        double total = 0;
        for (Product product : products){
            Product dbProduct = productRepository.findById(product.getId()).orElseThrow();
            if (!dbProduct.isActive()) {
                throw new RuntimeException("Inactive product bought");
            }
            total += dbProduct.getPrice();
        }

        order.setTotal(total);

        Long id = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());
        Person person = personRepository.findById(id).orElseThrow();
        order.setPerson(person);

        order.setParcelMachineName(parcelMachine);
        order.setPaymentState(PaymentState.INITIAL);

        Long orderId = orderRepository.save(order).getId();

        String everyPayUrl = makePayment(orderId, total);
        EveryPayLink  everyPayLink = new EveryPayLink();
        everyPayLink.setPaymentLink(everyPayUrl);
        return everyPayLink;
    }

    // https://www.err.ee/?order_reference=acd8&payment_reference=45ed2e64c09b343ac782e2682924341fe1afa579f46549da3d4188bd09017c5a
    // https://www.err.ee/?order_reference=acd9&payment_reference=48ed3f57265dbb34fe60a5e8ffc8e868ac6c991f74ee3228e2730e320e31fa76

    private String makePayment(Long orderId, double total) {
        EveryPayBody everyPayBody = new EveryPayBody();
        everyPayBody.setAccount_name("EUR3D1");
        everyPayBody.setNonce("das" + ZonedDateTime.now() + Math.random());
        everyPayBody.setTimestamp(ZonedDateTime.now().toString());
        everyPayBody.setAmount(total);
        everyPayBody.setOrder_reference("acd" + orderId.toString());
        everyPayBody.setCustomer_url(customerUrl);
        everyPayBody.setApi_username(username);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(username, password);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<EveryPayBody> httpEntity = new HttpEntity<>(everyPayBody, headers);

        String paymentUrl = url + "/oneoff";
        EveryPayResponse response = restTemplate.exchange(paymentUrl, HttpMethod.POST, httpEntity, EveryPayResponse.class).getBody();
        if (response == null) {
            throw new RuntimeException("Failed to send payment link");
        }
        return response.getPayment_link();
    }

    public PaymentStatus getPaymentStatus(String orderReference, String paymentReference) {

        String statusUrl = url + "/"+paymentReference+"?api_username=e36eb40f5ec87fa2&detailed=false";
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("e36eb40f5ec87fa2", "7b91a3b9e1b74524c2e9fc282f8ac8cd");

        EveryPayStatus response = restTemplate.exchange(statusUrl, HttpMethod.GET, new HttpEntity<>(headers), EveryPayStatus.class).getBody();

        System.out.println(response.getPayment_state());
        System.out.println(PaymentState.SETTLED);
        PaymentState paymentState = PaymentState.valueOf(response.getPayment_state().toUpperCase());

        if (response.getOrder_reference().equals(orderReference)) {
            Long orderId = Long.parseLong(response.getOrder_reference().replace("acd",""));
            Order order = orderRepository.findById(orderId).orElseThrow();
            order.setPaymentState(paymentState);
            orderRepository.save(order);
        }

        PaymentStatus paymentStatus = new PaymentStatus();
//        if (response != null) {
        paymentStatus.setPaymentState(paymentState);
//        }
        return paymentStatus;
    }
}
