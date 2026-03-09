package com.event.event_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.event.event_management.entity.Booking;
import com.event.event_management.entity.User;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	Optional<Booking> findByPaymentId(String paymentId);

	long countByStatus(String string);

	
	@Query("SELECT SUM(e.price) FROM Booking b JOIN b.event e WHERE b.status='CONFIRMED'")
	Double getTotalRevenue();
	
	List<Booking> findByUser(User user);
	
	List<Booking> findAllByOrderByBookingDateDesc();
	
	@Query("""
			SELECT MONTH(b.bookingDate) as month, SUM(e.price) as revenue
			FROM Booking b
			JOIN b.event e
			WHERE b.status = 'CONFIRMED'
			GROUP BY MONTH(b.bookingDate)
			ORDER BY MONTH(b.bookingDate)
			""")
			List<Object[]> getMonthlyRevenue();
			
			// ⭐ find user booking categories
		    @Query("SELECT b.event.category FROM Booking b WHERE b.user.id = :userId")
		    List<String> findUserBookingCategories(Long userId);
}

