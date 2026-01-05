package ee.mihkel.veebipood.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CronService {

    // * sekundid
    // * * minutid
    // * * * tunnid
    // * * * * kuu kuupäev
    // * * * * * kuu
    // * * * * * * nädalapäev

    @Scheduled(cron = "0 0 9-17 * * 1-5")
    public void run() {
        System.out.println("VeebipoodApplication running");
        // vaata kas on vaja meeldetuletuse emaile saata
    }
}
