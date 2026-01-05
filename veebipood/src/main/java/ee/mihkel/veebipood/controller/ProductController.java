package ee.mihkel.veebipood.controller;

import ee.mihkel.veebipood.entity.Product;
import ee.mihkel.veebipood.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
public class ProductController {

    // Dependency Injection
    @Autowired
    ProductRepository productRepository;

    // ProductRepository productRepository = new ProductRepository();

    // http://localhost:8080/products
    @GetMapping("admin-products")
    public List<Product> getAdminProducts(){
        return productRepository.findAllByOrderByIdAsc(); // SELECT * FROM products;
    }

    // http://localhost:8080/public-products?page=0&size=2
    @GetMapping("public-products")
    public Page<Product> getPublicProducts(Pageable  pageable){
        System.out.printf("Võetakse tooteid... %d ...", pageable.getPageSize());
        log.info("Võetakse tooteid... {} ...", pageable.getPageNumber());
        return productRepository.findByActiveTrue(pageable); // SELECT * FROM products;
    }

    // http://localhost:8080/category-products?categoryId=1
    @GetMapping("category-products")
    public List<Product> getCategoryProducts(@RequestParam Long categoryId){
        return productRepository.findByCategoryId(categoryId); // SELECT * FROM products;
    }

    // http://localhost:8080/products
    @PostMapping("products") // lisab siis, kui sellist ID-d pole olemas
    public List<Product> addProduct(@RequestBody Product product){
        if (product.getId() != null){
            throw new RuntimeException("Cannot add with ID");
        }
        if (product.getPrice() <= 0){
            throw new RuntimeException("Cannot add with negative price");
        }
        productRepository.save(product);
        return productRepository.findAllByOrderByIdAsc(); // SELECT * FROM products;
    }

    // http://localhost:8080/products?id=1
    @CacheEvict(value = "product2Cache", key = "#id")
    @DeleteMapping("products")
    public List<Product> deleteProduct(@RequestParam Long id){
        productRepository.deleteById(id);
        return productRepository.findAllByOrderByIdAsc();
    }

    // http://localhost:8080/products/1
    @Cacheable(value = "product2Cache", key = "#id")
    @GetMapping("products/{id}")
    public Product getProduct(@PathVariable Long id){
        return productRepository.findById(id).orElseThrow(); // SELECT * FROM products;
    }

    // http://localhost:8080/products
    @CachePut(value = "product2Cache", key = "#product.id")
    @PutMapping("products") // muudab siis, kui selline ID on olemas
    public List<Product> editProduct(@RequestBody Product product){
        if (product.getId() == null || product.getId() <= 0){
            throw new RuntimeException("Cannot edit without ID");
        }
        if (productRepository.findById(product.getId()).isEmpty()){
            throw new RuntimeException("No product with ID " + product.getId());
        }

        productRepository.save(product);
        return productRepository.findAllByOrderByIdAsc(); // SELECT * FROM products;
    }
}
