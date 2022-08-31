/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, you can say Hello or Help or schedule or reschedule or cancel or look up event an event or block a date in your calendar or you can ask for a summary of your day. Which would you like to try?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Hey, are you still there!')
            .getResponse();
    }
};

const busyDatesTimes=[];
const blockedDates=[];

const ScheduleEventIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ScheduleEventIntent';
    },
    handle(handlerInput) {
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let myDate = slots.EventDate.value;
        let myTime = slots.EventTime.value;
        let myEventName = slots.EventName.value;
        let speakOutput = '';
        let busy_slot = 0;
        
        for (var i = 0; i < busyDatesTimes.length; i++) {
                if ((busyDatesTimes[i][0] === myDate) && (busyDatesTimes[i][1] === myTime)) {
                    busy_slot = 1;
                }
        }
                
        if (blockedDates.some(row => JSON.stringify(row) === JSON.stringify (myDate))){
             speakOutput = `Your calendar is blocked for this day, please try another day. Current blocked dates are ${blockedDates}`;
        }
        else if (busy_slot === 1) { 
             speakOutput = `Your calendar is booked for this slot, please try another slot`;
        }
        else {
             //Code to add event to the list of events
             busyDatesTimes.push([myDate,myTime,myEventName]);
             speakOutput = `Your event ${myEventName} is scheduled, Have a good day!`;
        }
             
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
            
         
    }
};


const DeleteEventIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DeleteEventIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let myDate_1 = slots.EventDate.value;
        let myTime_1 = slots.EventTime.value;
        let myEventName_1 = slots.EventName.value;
        let speakOutput = '';

        if (busyDatesTimes.some(row => JSON.stringify(row) === JSON.stringify([myDate_1,myTime_1,myEventName_1]))){
             //Code to remove the event from the list of events
             for (var i = 0; i < busyDatesTimes.length; i++) {
                if ((busyDatesTimes[i][0] === myDate_1)&&(busyDatesTimes[i][1] === myTime_1)&&(busyDatesTimes[i][2] === myEventName_1)) {
                busyDatesTimes.splice(i, 1);
                }
            speakOutput = `Your event ${myEventName_1} is canceled, Have a good day!`;
            
            }
        }
        else {
             speakOutput = `There is no such event in your calendar!`;
        }       
       
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const LookupEventNameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LookupEventNameIntent';
    },
    handle(handlerInput) {
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let myEventName_2 = slots.EventName.value;
        let speakOutput = '';
        let lookup_match = 0;
        let lookup_event_date = '';
        let lookup_event_time = '';
        let lookupDatesTimes = [];
        
        for (var i=0; i<busyDatesTimes.length; i++){
            if (busyDatesTimes[i][2] === myEventName_2){
                lookupDatesTimes.push([busyDatesTimes[i][0],busyDatesTimes[i][1]]);
                lookup_match=1;
                }
            }
        
        if (lookup_match === 1){
             speakOutput = `Your calendar is scheduled for ${myEventName_2} on ${lookupDatesTimes}`;
        }
        else {
             speakOutput = `No, your calendar does not have that event`;
             }
             
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        
    }
};

const BlockDateEventIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BlockDateEventIntent';
    },
    handle(handlerInput) {
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let myDate_3 = slots.EventDate.value;
        let speakOutput = '';
        
        //add to blocked dates
        blockedDates.push(myDate_3);
        let blockconflict;
        let conflict_events = [];
        
        for (var i = 0; i < busyDatesTimes.length; i++) {
                if (busyDatesTimes[i][0] === myDate_3) {
                blockconflict = 1;
                conflict_events.push(busyDatesTimes[i]);
                }
        }
        
        if (blockconflict === 1){
        speakOutput = `Your calendar is blocked for ${myDate_3}. Also, there are appointments currently scheduled for this day. Please remember to cancel them. The events are ${conflict_events}`;
        blockconflict = 0; 
        }    
        else {
            speakOutput = `Your calendar is blocked for ${myDate_3}`;
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        
    }
};

const RescheduleEventIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RescheduleEventIntent';
    },
    handle(handlerInput) {
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let myDate_4 = slots.EventDate.value;
        let myTime_4 = slots.EventTime.value;
        let myEventName_4 = slots.EventName.value;
        let myDate_5 = slots.EventDateNew.value;
        let myTime_5 = slots.EventTimeNew.value;
        let speakOutput = '';
       
        if ((busyDatesTimes.some(row => JSON.stringify(row) === JSON.stringify([myDate_4,myTime_4,myEventName_4])))){
            for (var i = 0; i < busyDatesTimes.length; i++) {
                if ((busyDatesTimes[i][0] === myDate_4) && (busyDatesTimes[i][1] === myTime_4)) {
                    if (blockedDates.some(row => JSON.stringify(row) === JSON.stringify (myDate_5))){
                        speakOutput = `Sorry, your calendar is blocked for this day, please try another slot. Current blocked dates are ${blockedDates}`;
                    }
                    else {
                    busyDatesTimes[i][0] = myDate_5;
                    busyDatesTimes[i][1] = myTime_5;
                    speakOutput = `Your ${myEventName_4} is rescheduled to ${myDate_5} at ${myTime_5}`;
                    }
                }        
            } 
        }
        
        else {
             speakOutput = `Sorry, there is no such event in your calendar`;
        }
             
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        
    }
};

const SummaryOfDayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SummaryOfDayIntent';
    },
    handle(handlerInput) {
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let myDate_6 = slots.EventDate.value;
        let speakOutput = '';
        
        let summary_of_day = [];
        let day_present = 0;
        
        for (var i = 0; i < busyDatesTimes.length; i++) {
                if (busyDatesTimes[i][0] === myDate_6) {
                day_present = 1;
                summary_of_day.push([busyDatesTimes[i][1],busyDatesTimes[i][2]]);
                }
        }
        
        if (day_present === 1) {
            speakOutput = `Your summary for ${myDate_6} is ${summary_of_day}`;
        }
        else{
            speakOutput = `You have no events scheduled for ${myDate_6}`;
        }
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        ScheduleEventIntentHandler,
        DeleteEventIntentHandler,
        LookupEventNameIntentHandler,
        BlockDateEventIntentHandler,
        RescheduleEventIntentHandler,
        SummaryOfDayIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();