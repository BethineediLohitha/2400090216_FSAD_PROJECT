package com.loan.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "loan_offers")
public class LoanOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lender_id", nullable = false)
    private User lender;

    private double minAmount;
    private double maxAmount;
    private double interestRate;
    private int termInMonths;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, CLOSED

    public LoanOffer() {}

    public Long getId() { return id; }
    public User getLender() { return lender; }
    public double getMinAmount() { return minAmount; }
    public double getMaxAmount() { return maxAmount; }
    public double getInterestRate() { return interestRate; }
    public int getTermInMonths() { return termInMonths; }
    public String getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setLender(User lender) { this.lender = lender; }
    public void setMinAmount(double minAmount) { this.minAmount = minAmount; }
    public void setMaxAmount(double maxAmount) { this.maxAmount = maxAmount; }
    public void setInterestRate(double interestRate) { this.interestRate = interestRate; }
    public void setTermInMonths(int termInMonths) { this.termInMonths = termInMonths; }
    public void setStatus(String status) { this.status = status; }
}
