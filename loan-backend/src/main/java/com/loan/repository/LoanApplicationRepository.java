package com.loan.repository;

import com.loan.entity.LoanApplication;
import com.loan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByBorrower(User borrower);
    List<LoanApplication> findByLoanOffer_Lender(User lender);
}
