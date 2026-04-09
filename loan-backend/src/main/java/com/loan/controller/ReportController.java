package com.loan.controller;

import com.loan.entity.Transaction;
import com.loan.repository.TransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final TransactionRepository txnRepo;

    public ReportController(TransactionRepository txnRepo) {
        this.txnRepo = txnRepo;
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions() {
        return txnRepo.findAll();
    }
}
