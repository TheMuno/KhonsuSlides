import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQPqbtlfHPLpB-JYbyxDZiugu4NqwpSeM",
    authDomain: "askkhonsu-map.firebaseapp.com",
    projectId: "askkhonsu-map",
    storageBucket: "askkhonsu-map.appspot.com",
    messagingSenderId: "266031876218",
    appId: "1:266031876218:web:ec93411f1c13d9731e93c3",
    measurementId: "G-Z7F4NJ4PHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);   

async function retrieveSavedMarkersFromFirebase(userMail, arrivalDate=undefined) {
    const docRef = doc(db, 'Locations', `User-${userMail}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        // docSnap.data() will be undefined in this case
        console.log('No user with such email!');
        return; 
    } 

    const userName = userMail.substring(userMail.indexOf('-')+1, userMail.indexOf('@'));

    const userData = sortObject(docSnap.data());

    // const $daySlide = document.querySelector(`.cs_slide.${daySlideNum}`); 

    // const startDate = new Date(arrivalDate.replaceAll('-','/')); 

    for (let [day, locations] of Object.entries(userData)) {
        if (day.startsWith('_')) {

            console.log('Day:', day)

            
        }
    } 

    function sortObject(obj) {
        return Object.keys(obj).sort().reduce((result, key) => {   
            result[key] = obj[key];
            return result;
        }, {});
    }
}

retrieveSavedMarkersFromFirebase('one@mail.com'); 





const $publishBtn = document.querySelector('.publish'); 
const $downloadBtn = document.querySelector('.download');


/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '368323697117-1v3jo00lehtsj6kdj02r097ga934v641.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAPb84Iyn0uBewNM7Oovn0VZ8rpIP1h3tE';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC_Presentations = 'https://slides.googleapis.com/$discovery/rest?version=v1';
const DISCOVERY_DOC_Files = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive'; // https://www.googleapis.com/auth/drive.metadata.readonly 

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
gapi.load('client', initializeGapiClient);
// gapi.load('client', () => {
//     createPresentation('Askkhonsu-Custom-Travel-Plan', createSlide);
// });
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC_Presentations, DISCOVERY_DOC_Files],
});
gapiInited = true;
maybeEnableButtons();
// createPresentation('Askkhonsu-Custom-Travel-Plan', createSlide);
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
});
gisInited = true;
maybeEnableButtons();
// createPresentation('Askkhonsu-Custom-Travel-Plan', createSlide);
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
if (gapiInited && gisInited) {
    
    document.getElementById('authorize_button').style.visibility = 'visible';
}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
    throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    // await listSlides();
    await listFiles();

    const imgUrls = ['https://assets-global.website-files.com/61268cc8812ac5956bad13e4/65224587d4a92133be28cf73_Printed%20Khonsu%20Tailored%20Plan%20-%20TEMPLATE.png',
                    'https://assets-global.website-files.com/61268cc8812ac5956bad13e4/64ab6212f0f29612f2cfd8f9_Central%20Park%20lake%20couple.jpg',
                    'https://assets-global.website-files.com/61268cc8812ac5956bad13e4/654d862321c5794682d467d0_Statue%20Of%20Liberty.jpg'];

    // const templatePresentationId = '1PhHqb2lYMlcoi-6snsyt1cf9xH2r8nnv2vd7UE3nbxM';  
    // const templatePresentationId = '1s5zRdIWAFWbzxxriB-3NniCCj7WBKFmEBrtsN_R0Cn0';  // {{user-name}}
    // const templatePresentationId = '1DbtSZWDkHHHfUKwheiDENcg0xMml89CYVHyS1Q-0dd4';     // with images
    const templatePresentationId = '186IKtYygUerbUfk1LhhiMjMKkSfqb0ty3L_BwOfLFWQ';     // official template 
    
    await textMerging(templatePresentationId, ()=>{
    console.log('ran yes....')
    });

};

if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
} else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
}
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
const token = gapi.client.getToken();
if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
}
}


async function listFiles() {
let response;
try {
    response = await gapi.client.drive.files.list({
    'pageSize': 10,
    // 'fields': 'files(id, name, webContentLink)',
    'fields': 'files(id, webContentLink)',
    });
} catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
}

console.log('Files Response:', response, '\n Files', gapi.client.drive.files)


const files = response.result.files;
if (!files || files.length == 0) {
    document.getElementById('content').innerText = 'No files found.';
    return;
}
// Flatten to string to display
const output = files.reduce(
    (str, file) => `${str}${file.name} (${file.id})\n`,
    'Files:\n');
document.getElementById('content').innerText = output;
}



async function textMerging(templatePresentationId, callback) {
// Use the Sheets API to load data, one record per row.
const responses = [];
const dataRangeNotation = 'Customers!A2:M6';
try {
    // gapi.client.sheets.spreadsheets.values.get({
    //   spreadsheetId: dataSpreadsheetId,
    //   range: dataRangeNotation,
    // }).then((sheetsResponse) => {
    //   const values = sheetsResponse.result.values;
    //   // For each record, create a new merged presentation.

    const uname = document.querySelector('#uname').value.trim() || 'No User';
    const date = document.querySelector('#date').value.trim() || 'Jan 01 - Jan 02';


    const values = [
        [uname, date, 
        'Grand Central Station', 'Manhattan, NY 10036',
        'Summit One', '45 Rockefeller Plaza, New York, NY 10111',
        'Top Of the Rock', '30 Rockefeller Plaza, New York, NY 10112'],
        // ['Mui', 'A guy', 'Designer'],
        // ['KK', 'A gal', 'Dev'],
    ];

    // values.forEach(row => {
    //   const userName = row[0]; 
    //   const travelDate = row[1]; 
    //   const eventName1 = row[2]; 
    //   const eventAddress1 = row[3]; 
    //   const eventName2 = row[4]; 
    //   const eventAddress2 = row[5]; 
    //   const eventName3 = row[6]; 
    //   const eventAddress3 = row[7]; 

    //   const requests = [];
    //   const replaceText = {};
    //   replaceText.containsText = {
    //       text: '{{travel-date}}',
    //       matchCase: true,
    //   };
    //   replaceText.replaceText = travelDate;
    //   requests.push({replaceText});

    // });

    for (let i = 0; i < values.length; ++i) {
        const row = values[i];
        const userName = row[0]; 
        const travelDate = row[1]; 
        const eventName1 = row[2]; 
        const eventAddress1 = row[3]; 
        const eventName2 = row[4]; 
        const eventAddress2 = row[5]; 
        const eventName3 = row[6]; 
        const eventAddress3 = row[7]; 

        console.log(`userName: ${userName} \n travelDate: ${travelDate} `)//\n totalPortfolio: ${totalPortfolio}`)

        // Duplicate the template presentation using the Drive API.
        const copyTitle = userName + ' presentation';
        const request = {
        name: copyTitle,
        };

        gapi.client.drive.files.copy({
        fileId: templatePresentationId,
        requests: request,
        }).then((driveResponse) => {
        const presentationCopyId = driveResponse.result.id;

        // const requests = [];
        // const replaceText = {};
        // replaceText.containsText = {
        //     text: '{{travel-date}}',
        //     matchCase: true,
        // };
        // replaceText.replaceText = travelDate;
        // requests.push({replaceText}); 

        // Create the text merge (replaceAllText) requests for this presentation.
        const requests = [{
            replaceAllText: {
            containsText: {
                text: '{{user-name}}',
                matchCase: true,
            },
            replaceText: userName,
            },
        }, {
            replaceAllText: {
            containsText: {
                text: '{{travel-date}}',
                matchCase: true,
            },
            replaceText: travelDate,
            },
        }, {
            replaceAllText: {
            containsText: {
                text: '{{event-name-1}}',
                matchCase: true,
            },
            replaceText: eventName1,
            },
        }, {
            replaceAllText: {
            containsText: {
                text: '{{event-address-1}}',
                matchCase: true,
            },
            replaceText: eventAddress1,
            },
        }, {
            replaceAllText: {
            containsText: {
                text: '{{event-name-2}}',
                matchCase: true,
            },
            replaceText: eventName2,
            },
        }, {
            replaceAllText: {
            containsText: {
                text: '{{event-address-2}}',
                matchCase: true,
            },
            replaceText: eventAddress2,
            },
        }, {
            replaceAllText: {
            containsText: {
                text: '{{event-name-3}}',
                matchCase: true,
            },
            replaceText: eventName3,
            },
        }, {
            replaceAllText: {
            containsText: {
                text: '{{event-address-3}}',
                matchCase: true,
            },
            replaceText: eventAddress3,
            },
        }];

        // Execute the requests for this presentation.
        gapi.client.slides.presentations.batchUpdate({
            presentationId: presentationCopyId,
            requests: requests,
        }).then((batchUpdateResponse) => {
            const result = batchUpdateResponse.result;

            // console.log('requests:', requests, '\nresult:', result, 'batchUpdateResponse:', batchUpdateResponse)  

            responses.push(result.replies);
            // Count the total number of replacements made.
            let numReplacements = 0;
            for (let i = 0; i < result.replies.length; ++i) {
            numReplacements += result.replies[i].replaceAllText.occurrencesChanged;
            }
            console.log(`Created presentation for ${userName} with ID: ${presentationCopyId}`);
            console.log(`Replaced ${numReplacements} text instances`);
            if (responses.length === values.length) { // callback for the last value
            if (callback) callback(responses);
            }
        });


        // setup publish link btn
        $publishBtn.classList.remove('hide');
        $publishBtn.addEventListener('click', ()=>{
            const publishLink = `https://docs.google.com/presentation/d/${presentationCopyId}/preview`; 
            // change the url from /preview to /preview?rm=minimal to remove the slide controls if needed
            window.open(publishLink);
        });

        // setup download btn 
        $downloadBtn.classList.remove('hide');
        $downloadBtn.addEventListener('click', e => {
            const downloadLink = `https://docs.google.com/presentation/d/${presentationCopyId}/export?format=pdf`;
            window.open(downloadLink);
        });

        });


    }


    // });
} catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
}
}


const script1 = document.createElement('script');
document.body.appendChild(script1);
script1.onload = gapiLoaded; 
script1.src = 'https://apis.google.com/js/api.js';

const script2 = document.createElement('script');
document.body.appendChild(script2);
script2.onload = gisLoaded; 
script2.src = 'https://accounts.google.com/gsi/client';

document.querySelector('#authorize_button').addEventListener('click', handleAuthClick);

