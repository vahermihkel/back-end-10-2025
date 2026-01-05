package ee.mihkel.veebipood.model;

import ee.mihkel.veebipood.entity.PaymentState;
import lombok.Data;

@Data
public class PaymentStatus {
    private PaymentState paymentState;
}
