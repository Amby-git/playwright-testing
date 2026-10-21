
package com.karate.runner;

import com.intuit.karate.junit5.Karate;

public class TestRunner {
    @Karate.Test
    Karate testAll() {
        return Karate.run("classpath:features/checkout.feature")
                .tags("@test")
                .relativeTo(getClass());
    }
}
