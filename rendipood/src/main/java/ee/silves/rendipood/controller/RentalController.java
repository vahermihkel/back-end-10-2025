package ee.silves.rendipood.controller;

import ee.silves.rendipood.entity.Film;
import ee.silves.rendipood.entity.Rental;
import ee.silves.rendipood.model.FilmRental;
import ee.silves.rendipood.repository.RentalRepository;
import ee.silves.rendipood.service.RentalService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // TODO: change
public class RentalController {

    @Autowired
    private RentalService rentalService;

    @Autowired
    private RentalRepository rentalRepository;

    @GetMapping("rentals")
    public ResponseEntity<List<Rental>> getAllRentals(){
        return ResponseEntity.status(200).body(rentalRepository.findAll());
    }

    @GetMapping("rentals/{id}")
    public ResponseEntity<Rental> getRental(@PathVariable Long id){
        return ResponseEntity.status(200).body(rentalService.findRentalById(id));
    }

    @Transactional
    @PostMapping("start-rental")
    public Rental startRental(@RequestBody List<FilmRental> filmRentals) {
        return rentalService.startRentalAndCalculateInitialFee(filmRentals);
    }

    @PutMapping("end-rental")
    public Rental endRental(@RequestParam Long rentalId, @RequestParam int extraDays) {
        return rentalService.endRental(rentalId, extraDays);
    }

    // http://localhost:8080/unrent-film?id=1&days=2
    @PatchMapping("unrent-film")
    public ResponseEntity<Film> unrentFilm(@RequestParam Long id, int extraDays) {
        return ResponseEntity.ok().body(rentalService.unrentFilm(id, extraDays));
    }
}
