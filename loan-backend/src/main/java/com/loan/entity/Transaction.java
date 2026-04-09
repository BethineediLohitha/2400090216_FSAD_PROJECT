package com.loan.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id")
    private LoanApplication loanApplication;

    private double amount;

    @Column(nullable = false)
    private String type; // LOAN_DISBURSEMENT, LOAN_REPAYMENT

    private LocalDateTime createdAt = LocalDateTime.now();

    public Transaction() {}

    public Transaction(LoanApplication app, double amount, String type) {
        this.loanApplication = app;
        this.amount = amount;
        this.type = type;
    }

    public Long getId() { return id; }
    public LoanApplication getLoanApplication() { return loanApplication; }
    public double getAmount() { return amount; }
    public String getType() { return type; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setLoanApplication(LoanApplication loanApplication) { this.loanApplication = loanApplication; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setType(String type) { this.type = type; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
