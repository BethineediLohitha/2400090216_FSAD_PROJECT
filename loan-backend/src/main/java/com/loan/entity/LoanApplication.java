package com.loan.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_applications")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "borrower_id", nullable = false)
    private User borrower;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offer_id", nullable = false)
    private LoanOffer loanOffer;

    private double amount;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    private LocalDateTime appliedAt = LocalDateTime.now();

    public LoanApplication() {}

    public Long getId() { return id; }
    public User getBorrower() { return borrower; }
    public LoanOffer getLoanOffer() { return loanOffer; }
    public double getAmount() { return amount; }
    public String getStatus() { return status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }

    public void setId(Long id) { this.id = id; }
    public void setBorrower(User borrower) { this.borrower = borrower; }
    public void setLoanOffer(LoanOffer loanOffer) { this.loanOffer = loanOffer; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setStatus(String status) { this.status = status; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
