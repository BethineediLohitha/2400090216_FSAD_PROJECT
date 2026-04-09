package com.loan.controller;

import com.loan.entity.*;
import com.loan.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanOfferRepository offerRepo;
    private final LoanApplicationRepository appRepo;
    private final UserRepository userRepo;
    private final TransactionRepository txnRepo;

    public LoanController(LoanOfferRepository offerRepo, LoanApplicationRepository appRepo,
                          UserRepository userRepo, TransactionRepository txnRepo) {
        this.offerRepo = offerRepo;
        this.appRepo = appRepo;
        this.userRepo = userRepo;
        this.txnRepo = txnRepo;
    }

    // ── OFFERS ──
    @GetMapping("/offers")
    public List<LoanOffer> getActiveOffers() {
        return offerRepo.findByStatus("ACTIVE");
    }

    @GetMapping("/offers/{id}")
    public ResponseEntity<?> getOfferById(@PathVariable Long id) {
        return offerRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/offers/{id}")
    public ResponseEntity<?> updateOffer(@PathVariable Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        LoanOffer offer = offerRepo.findById(id).orElseThrow();
        if (!offer.getLender().getUsername().equals(auth.getName()))
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        if (body.containsKey("minAmount")) offer.setMinAmount(((Number) body.get("minAmount")).doubleValue());
        if (body.containsKey("maxAmount")) offer.setMaxAmount(((Number) body.get("maxAmount")).doubleValue());
        if (body.containsKey("interestRate")) offer.setInterestRate(((Number) body.get("interestRate")).doubleValue());
        if (body.containsKey("termInMonths")) offer.setTermInMonths(((Number) body.get("termInMonths")).intValue());
        return ResponseEntity.ok(offerRepo.save(offer));
    }

    @GetMapping("/offers/mine")
    public List<LoanOffer> getMyOffers(Authentication auth) {
        User lender = userRepo.findByUsername(auth.getName()).orElseThrow();
        return offerRepo.findByLender(lender);
    }

    @PostMapping("/offers")
    public ResponseEntity<?> createOffer(@RequestBody Map<String, Object> body, Authentication auth) {
        User lender = userRepo.findByUsername(auth.getName()).orElseThrow();
        LoanOffer offer = new LoanOffer();
        offer.setLender(lender);
        offer.setMinAmount(((Number) body.get("minAmount")).doubleValue());
        offer.setMaxAmount(((Number) body.get("maxAmount")).doubleValue());
        offer.setInterestRate(((Number) body.get("interestRate")).doubleValue());
        offer.setTermInMonths(((Number) body.get("termInMonths")).intValue());
        return ResponseEntity.ok(offerRepo.save(offer));
    }

    @DeleteMapping("/offers/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id, Authentication auth) {
        LoanOffer offer = offerRepo.findById(id).orElseThrow();
        if (!offer.getLender().getUsername().equals(auth.getName()))
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        offer.setStatus("CLOSED");
        offerRepo.save(offer);
        return ResponseEntity.ok(Map.of("message", "Offer closed successfully"));
    }

    // ── APPLICATIONS ──
    @GetMapping("/applications")
    public List<LoanApplication> getAllApplications() {
        return appRepo.findAll();
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        return appRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/applications/mine")
    public List<LoanApplication> getMyApplications(Authentication auth) {
        User borrower = userRepo.findByUsername(auth.getName()).orElseThrow();
        return appRepo.findByBorrower(borrower);
    }

    @GetMapping("/applications/lender")
    public List<LoanApplication> getLenderApplications(Authentication auth) {
        User lender = userRepo.findByUsername(auth.getName()).orElseThrow();
        return appRepo.findByLoanOffer_Lender(lender);
    }

    @PostMapping("/applications")
    public ResponseEntity<?> applyForLoan(@RequestBody Map<String, Object> body, Authentication auth) {
        User borrower = userRepo.findByUsername(auth.getName()).orElseThrow();
        Long offerId = ((Number) body.get("offerId")).longValue();
        double amount = ((Number) body.get("amount")).doubleValue();

        LoanOffer offer = offerRepo.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        if (amount < offer.getMinAmount() || amount > offer.getMaxAmount())
            return ResponseEntity.badRequest().body(Map.of("message",
                    "Amount must be between $" + offer.getMinAmount() + " and $" + offer.getMaxAmount()));

        LoanApplication app = new LoanApplication();
        app.setBorrower(borrower);
        app.setLoanOffer(offer);
        app.setAmount(amount);
        return ResponseEntity.ok(appRepo.save(app));
    }

    @PostMapping("/applications/{id}/approve")
    public ResponseEntity<?> approveApplication(@PathVariable Long id, Authentication auth) {
        LoanApplication app = appRepo.findById(id).orElseThrow();
        if (!app.getLoanOffer().getLender().getUsername().equals(auth.getName()))
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        app.setStatus("APPROVED");
        appRepo.save(app);
        txnRepo.save(new Transaction(app, app.getAmount(), "LOAN_DISBURSEMENT"));
        return ResponseEntity.ok(app);
    }

    @PostMapping("/applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable Long id, Authentication auth) {
        LoanApplication app = appRepo.findById(id).orElseThrow();
        if (!app.getLoanOffer().getLender().getUsername().equals(auth.getName()))
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        app.setStatus("REJECTED");
        return ResponseEntity.ok(appRepo.save(app));
    }

    // ── EMI CALCULATOR ──
    @GetMapping("/emi")
    public ResponseEntity<?> calculateEmi(@RequestParam double principal,
                                           @RequestParam double rate,
                                           @RequestParam int months) {
        double mr = rate / 12 / 100;
        double emi = mr == 0 ? principal / months :
                (principal * mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1);
        double total = emi * months;
        double interest = total - principal;
        return ResponseEntity.ok(Map.of(
                "emi", Math.round(emi),
                "totalPayment", Math.round(total),
                "totalInterest", Math.round(interest),
                "principal", principal,
                "months", months,
                "rate", rate
        ));
    }

    // ── STATS ──
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) {
        User user = userRepo.findByUsername(auth.getName()).orElseThrow();
        Map<String, Object> stats = new HashMap<>();

        if (user.getRole().equals("ROLE_BORROWER")) {
            List<LoanApplication> apps = appRepo.findByBorrower(user);
            stats.put("total", apps.size());
            stats.put("approved", apps.stream().filter(a -> a.getStatus().equals("APPROVED")).count());
            stats.put("pending", apps.stream().filter(a -> a.getStatus().equals("PENDING")).count());
            stats.put("rejected", apps.stream().filter(a -> a.getStatus().equals("REJECTED")).count());
            stats.put("totalApprovedAmount", apps.stream().filter(a -> a.getStatus().equals("APPROVED")).mapToDouble(LoanApplication::getAmount).sum());
        } else if (user.getRole().equals("ROLE_LENDER")) {
            List<LoanApplication> apps = appRepo.findByLoanOffer_Lender(user);
            stats.put("totalApplications", apps.size());
            stats.put("approved", apps.stream().filter(a -> a.getStatus().equals("APPROVED")).count());
            stats.put("pending", apps.stream().filter(a -> a.getStatus().equals("PENDING")).count());
            stats.put("totalDisbursed", apps.stream().filter(a -> a.getStatus().equals("APPROVED")).mapToDouble(LoanApplication::getAmount).sum());
            stats.put("totalOffers", offerRepo.findByLender(user).size());
        }
        return ResponseEntity.ok(stats);
    }
}
