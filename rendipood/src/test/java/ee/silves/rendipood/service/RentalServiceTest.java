package ee.silves.rendipood.service;

import ee.silves.rendipood.entity.Film;
import ee.silves.rendipood.entity.FilmType;
import ee.silves.rendipood.entity.Rental;
import ee.silves.rendipood.model.FilmRental;
import ee.silves.rendipood.repository.FilmRepository;
import ee.silves.rendipood.repository.RentalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class RentalServiceTest {

    @Mock
    private FilmRepository filmRepository;

    @Mock
    private RentalRepository rentalRepository;

    @InjectMocks
    private RentalService rentalService;

    List<FilmRental> filmRentals = new ArrayList<>();
    Rental rental;


    @BeforeEach
    void setUp() {
        createFilm(1L, 2, FilmType.NEW);
        createFilm(2L, 0 , FilmType.NEW);
        createFilm(3L, 0 , FilmType.REGULAR);
        createFilm(4L, 0 , FilmType.OLD);
        Rental rental1 = new Rental();
//        rental1.setInitialFee(12);
        when(rentalRepository.save(any())).thenReturn(rental1);
    }

    private void createFilm(long id, int days, FilmType filmType) {
        Film film = new Film();
        film.setId(id);
        film.setDays(days);
        film.setTitle("Film");
        film.setType(filmType);
        if (days > 0) {
            rental = new Rental();
            rental.setCreated(new Date());
            film.setRental(rental);
        }
        when(filmRepository.findById(id)).thenReturn(Optional.of(film));
    }

    private void addToFilmRentals(long filmId, int rentedDays) {
        FilmRental filmRental = new FilmRental();
        filmRental.setFilmId(filmId);
        filmRental.setRentedDays(rentedDays);
        filmRentals.add(filmRental);
    }

    @Test
    void startRentalAndCalculateInitialFee_throwsException_whenRentedDaysAre0() {
        addToFilmRentals(1L, 0);
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> rentalService.startRentalAndCalculateInitialFee(filmRentals));

        assertEquals("Film must be rented at least 1 day!", exception.getMessage());
    }

    @Test
    void startRentalAndCalculateInitialFee_throwsException_whenFilmDaysAre2() {
        addToFilmRentals(1L, 2);
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> rentalService.startRentalAndCalculateInitialFee(filmRentals));

        assertEquals("Film is already rented out!", exception.getMessage());
    }

    @Test
    void startRentalAndCalculateInitialFee_initialFeeIs12_whenNewFilmIsRentedFor3Days() {
        addToFilmRentals(2L, 3);
        Rental rental = rentalService.startRentalAndCalculateInitialFee(filmRentals);

        assertEquals(12, rental.getInitialFee());
    }

    @Test
    void startRentalAndCalculateInitialFee_initialFeeIs6_whenRegularFilmIsRentedFor4Days() {
        addToFilmRentals(3L, 4);
        Rental rental = rentalService.startRentalAndCalculateInitialFee(filmRentals);

        assertEquals(6, rental.getInitialFee());
    }

    @Test
    void startRentalAndCalculateInitialFee_initialFeeIs3_whenOldFilmIsRentedFor5Days() {
        addToFilmRentals(4L, 5);
        Rental rental = rentalService.startRentalAndCalculateInitialFee(filmRentals);

        assertEquals(3, rental.getInitialFee());
    }

    @Test
    void startRentalAndCalculateInitialFee_initialFeeIs3_whenOldFilmAndRegularFilmAndNewFilmIsRentedFor5Days() {
        addToFilmRentals(2L, 5);
        addToFilmRentals(3L, 5);
        addToFilmRentals(4L, 5);

        Rental rental = rentalService.startRentalAndCalculateInitialFee(filmRentals);

        assertEquals(32, rental.getInitialFee());
    }

    @Test
    void endRental() {

    }

    @Test
    void unrentFilm() {
        Film film = rentalService.unrentFilm(1L, 2);
        assertNull(film.getRental());
    }

    @Test
    void unrentFilm2() {
        Film film = rentalService.unrentFilm(1L, 5);
        assertEquals(12, rental.getLateFee());
    }
}