The survey module deals with creating survey. 

### A brief intro to surveys in SARA
In SARA, self-reporting happens in the surveys. The content of the survey is dependent on a researcher's scientific interests. The goal of SARA is to increase these surveys with incentive. 


### Key features of the survey module
- The survey module contains a survey generator which takes a JSON formatted questionaire and generate a survey. Typically, a domain scientist decides what questions they want to ask. 
- It is easy to create your own survey as a component/form by only specifying a link to the JSON survey.  



### Technical details
As already mentioned, the surveys are defined using a JSON formatted file. The `./dynamic-survey/dynamic-survey.component.ts` file converts the JSON into visual form.

You can see the links to the JSON file and `dynamic-survey.component.ts` below. 
We also created a sample survey in the link `./sample-survey/sample-survey.component.ts` 
and `./sample-survey/sample-survey.component.html`. The `sample-survey.component.html` shows 
the 'one line code' that you can change to point to the survey you want to populate from `/assets/data/` directory.

Summary of important files in the survey module:
1. Survey questions are stored in `/assets/data/questions.json`
2. `./dynamic-survey/dynamic-survey.component.ts` generates
survey, uses services in storage module to encrpt data and upload to
cloud.