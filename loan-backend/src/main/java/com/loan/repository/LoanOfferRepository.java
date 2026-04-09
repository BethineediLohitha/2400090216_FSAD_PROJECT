package com.loan.repository;

import com.loan.entity.LoanOffer;
import com.loan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanOfferRepository extends JpaRepository<LoanOffer, Long> {
    List<LoanOffer> findByStatus(String status);
    List<LoanOffer> findByLender(User lender);
}
