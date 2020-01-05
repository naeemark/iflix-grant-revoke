# iflix Coding Assignment

Welcome to the iflix Coding Assignment! We can't wait to see what you come up with!

**Please read through this entire file before starting the test.**

At iflix, we give our users free access through Partner networks - mobile or broadband, and we call these Offers. It's up to the partner how many months of free sweet sweet iflix each person gets. This assignment is focussed around solving a simplified version of that logic.

## Inputs

We've provided you two three different inputs into your solution. These are located within the `/data` path. You will need to use all of them:

* `accounts.json` - A list of our user accounts. You should ignore any data which doesn't map to an existing user account.
* `amazecom.json` - One of our Partners, AmazeCom provides us a list of Offers in JSON format.
* `wondertel.json` - Another one of our partners, WunderTel also provides us a list of Offers in the same JSON format.

The format and rules surrounding the Partner files are described below under **Offers**.

## Output

Your program will need to load these inputs, process them according to the rules under **Offers** below, and output a single file as `./output/result.json`, which contains the output from the analysis results.

The output should be focussed around each account. For each account, we want to know the number of whole days (rounded down) the user has had free iflix from each Partner.

The format of the JSON output file should match this structure:

```
{
  "subscriptions": {
    "Sally": {
      "amazecom": 34,
      "wondertel": 62
    },
    "Farhan": {
      "amazecom": 34
    }
  }
}
```

## Implementation

We mostly NodeJS at iflix, but we've all had history with Java,
Python, C/++/#, Elixir, and Ruby. Choose one that you're most comfortable with.

You should write your code as if it's going straight to Production, so it needs to be production ready, and maintainable for other developers. To that end, heres what we care about when we write code, and we want you to care about these things too, so we expect the following to be demonstrated in your code base:

* **Domain Modeling** - Your solution should model the domain it's working within for clarity.
* **Design Patterns** - Don't reinvent the wheel. If you know a pattern which suits, use it.
* **Automated Tests** - Your code should be fully tested. See below under **Testing**
* **Logging** - Your code should include logs, logging to `STDOUT`. Logging is essential in debugging a system running in production. Logs at the `INFO` level should include decisions your program is making, while the `DEBUG` level can be anything that adds more context to the decision.
* **Metrics** - We care about how the system is operating, and our metrics are used to report on important business-level events. We'd like you to think about what metrics you should track in your solution, and at minimum create comments in your code around what metric you'd increment/decrement at that point.
* **Performant** - You don't need to optimise to the millisecond level, but don't do things which will obviously cause performance issues in production.
* **Failure Handling** - You should expect things to go wrong, and assumptions to be wrong. Your code should handle these situations.
* **Git Commits** - This repo is a git repo. You should have small, frequent, focussed and atomic commits to the codebase which illustrates your progression through the problem.

## Testing

At iflix, we believe tests are better than documentation. Your tests are what describes your solution, so Unit and Integration tests are a must. We've even given you a `test` path for you to put your tests inside. We want you to test the happy path, edge cases and failure scenarios. If your test framework uses a different path, feel free to rename the one we've provided.

Additionally, you should include a System test to verify your solution in its entirety. We've provided a test fixture at `test/fixture/expected_output.json` for you to write a test around, which you should use.

## Offer Rules

There are two inputs into the Offer algorithm:

* `GRANT` Offers, which give a user an Offer.
* `REVOKE` Offers, which removes the Offer.

Our Partners aren't aware of user accounts in our system, so instead they send MSISDNs for each user.

**GRANT Offers**

Format:

Each `GRANT` contains:

* The users phone number
* The date (ISO8601 format) at which the GRANT starts
* The period of free iflix for that user, in months.

Rules:

* The first partner to give a GRANT "owns" that user. Other partners cannot add to that users Offer.
* Expiring GRANTs from the same partner stack on top of each other if still active.
* Offer months are by calendar months, not in 30 day blocks.
* GRANT offers without a period defined should be ignored entirely.

**REVOKE Offers**

Each `REVOKE` contains:

* The users phone number
* The date (ISO8601 format) at which the REVOKE is effective from

Rules:

* A partner can only revoke an Offer if they "own" the user.
* REVOKE of an expired Offer is possible, the user should be "released" from the partner.
* REVOKEs should be processed before GRANTs.

**Examples**

```
Partner A issues a GRANT to John for 3 months.
Partner B issues a GRANT to John 4 months later.

John is still owned by Partner A, so Partner B's Offer is ignored
```

```
Partner A issues a GRANT to John for 3 months.
Partner A issues a REVOKE to John 2 months later.
Partner B issues a GRANT to John for 2 months at the exact same time as the REVOKE was issued.

John gets 2 months from Partner A and 2 months from Partner B.
```

```
Partner A issues a GRANT to John for 3 months.
Partner A issues a REVOKE to John 2 months later.
Partner B issues a GRANT to John for 2 months, but 1 day before the REVOKE was issued.

John gets 2 months from Partner A, and Partner B is ignored.
```

```
Partner A issues a GRANT to John for 4 months.
Partner A issues a GRANT to John for 6 months, 3 months later.

John has 10 months free iflix from Partner A.
```

## Submission

Your submission must run on either Linux or OSX, so make sure you handle things like file paths correctly if you're developing on Windows. Most platforms are able to provide a file path handling module to abstract this problem away, so use that.

The code you write for the solution should be in the `lib` folder, and your tests should be in the `test` folder (or similar if your framework uses something different). Unit, integration and system tests should be in separate folders within there.

Your solution should update the `bin/run` script to install all dependencies and execute your application. It should provide the result JSON file into the `output` folder of the project.

Similarly, your solution should update the `bin/test` script to install all dependencies and run your automated tests.

Take some time to describe your submission's approach, and any platform requirements (i.e. Oracle Java 8 etc) which cannot be automatically installed via the `bin/` scripts. Put this into a `SUBMISSION.md` file in the root of your project.

When you're ready, please zip the entire project folder, including the `.git` folder and submit it via email to `hannah@iflix.com`. Please ensure the zip file is your name so we know who it belongs to!

**Best of luck**

The iflix Engineering Team
