package ee.silves.rendipood.service;

import ee.silves.rendipood.entity.Film;
import ee.silves.rendipood.entity.Rental;
import ee.silves.rendipood.model.FilmRental;
import ee.silves.rendipood.repository.FilmRepository;
import ee.silves.rendipood.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class RentalService {

//    @Value("${rental.price.premium}")
    private int premiumPrice = 4;

//    @Value("${rental.price.basic}")
    private int basicPrice = 3;

//    @Value("${rental.free-days.regular}")
    private int regularFreeDays = 3;

//    @Value("${rental.free-days.old}")
    private int oldFreeDays = 5;

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private FilmRepository filmRepository;

    public Rental startRentalAndCalculateInitialFee(List<FilmRental> filmRentals) {
        Rental rental = new Rental();
        rental.setCreated(new Date());
//        Rental dbRental = rentalRepository.save(rental);
        List<Film> rentalFilms = new ArrayList<>();

        double sum = 0;
        for (FilmRental filmRental : filmRentals) {
            if (filmRental.getRentedDays() <= 0) {
                throw new RuntimeException("Film must be rented at least 1 day!");
            }
            Film film = filmRepository.findById(filmRental.getFilmId()).orElseThrow();
            film.setRental(rental);
            rentalFilms.add(film);
            if (film.getDays() != 0) {
                throw new RuntimeException("Film is already rented out!");
            }
            film.setDays(filmRental.getRentedDays());
//            filmRepository.save(film);
            sum = calculateFilmFee(film, sum);
        }
        rental.setFilms(rentalFilms); // rentalile paneme setFilms
        rental.setInitialFee(sum);
        rentalRepository.save(rental); // rentali salvestame ära
        return rental;
    }

    private double calculateFilmFee(Film film, double sum) {
        switch (film.getType()) {
            case NEW -> sum += film.getDays() * premiumPrice;
            case REGULAR -> {
                if (regularFreeDays < film.getDays()) {
                    sum += basicPrice + (film.getDays() - regularFreeDays) * basicPrice;
                } else {
                    sum += basicPrice;
                }
            }
            case OLD -> {
                if (oldFreeDays < film.getDays()) {
                    sum += basicPrice + (film.getDays() - oldFreeDays) * basicPrice;
                } else {
                    sum += basicPrice;
                }
            }
        }
        return sum;
    }

    public Rental endRental(Long rentalId, int extraDays) {
        Rental dbRental =  rentalRepository.findById(rentalId).orElseThrow();
        calculateLateFee(extraDays, dbRental);
        return rentalRepository.save(dbRental);
    }

    private void calculateLateFee(int extraDays, Rental dbRental) {
        int fullDaysPassed = getFullDaysPassed(extraDays, dbRental);

        double lateFee = 0;
        for (Film film : dbRental.getFilms()) {
            lateFee += getLateFee(film, fullDaysPassed);
        }
        dbRental.setLateFee(lateFee);
    }

    private int getFullDaysPassed(int extraDays, Rental dbRental) {
        long millisPerDay = 1000 * 60 * 60 * 24;
        long millis = new Date().getTime() - dbRental.getCreated().getTime();
        return Math.toIntExact(millis / millisPerDay) + extraDays;
    }

    private double getLateFee(Film film, int fullDaysPassed) {
        int fee = 0;
        if (film.getDays() != 0) {
            if (film.getDays() < fullDaysPassed) {
                switch (film.getType()) {
                    case NEW -> fee = premiumPrice * (fullDaysPassed - film.getDays());
                    case REGULAR,OLD -> fee = basicPrice * (fullDaysPassed - film.getDays());
                }
            }
            film.setDays(0);
            film.setRental(null);
            filmRepository.save(film); // ei oleks vaja kui rental.setFilms()
        }
        return fee;
    }

    public Film unrentFilm(Long id, int extraDays) {
        Film film = filmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Film not found with id: " + id));
        Rental dbRental = film.getRental();
        int getFullDaysPassed =  getFullDaysPassed(extraDays, dbRental);
        double latefee = getLateFee(film, getFullDaysPassed);
        dbRental.setLateFee(dbRental.getLateFee() + latefee);
        rentalRepository.save(dbRental);
        return film;
    }

    public Rental findRentalById(Long id) {
        return rentalRepository.findById(id).orElseThrow();
    }
}
