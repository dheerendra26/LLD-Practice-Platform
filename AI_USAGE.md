# AI Usage

I used Gemini API in this project to provide feedback on the LLD solutions submitted by the learner.

The basic idea is simple: the learner selects an LLD problem and writes their solution. The problem details and submitted answer are sent to Gemini, and the response is used to show feedback to the learner.

I used AI mainly for:

* Reviewing the submitted LLD solution.
* Giving an overall score.
* Pointing out possible issues or missing parts.
* Giving suggestions for improvement.

I did not use AI to create a separate AI model. I used the Gemini API and its available models for generating the feedback.

I also used AI during development for some coding help and debugging. I still tested the changes myself and adjusted them according to how the application was actually working.

## Limitations

The feedback is not guaranteed to be completely correct. LLD problems can have multiple valid approaches, so the AI's suggestions should be treated as guidance rather than an absolute answer.

The quality of the feedback can also depend on how clearly the learner explains their design.

## What I learned

The main thing I learned was that adding AI does not automatically make a product useful. The important part is deciding where the AI actually helps the user.

In this project, I tried to keep AI focused on one clear purpose: helping a learner understand their LLD solution better.
