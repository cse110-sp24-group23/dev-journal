import LocalStorageAccomplishmentsApi from "../backend-storage/accomplishments-api.js";
import { AccomplishmentsObj } from "../backend-storage/accomplishments-class.js";

function loadAccomplishmentFromStorage(){
    const allAccomplishmentsObj = LocalStorageAccomplishmentsApi.getAllAccomplishmentsObj();
    const dateCol = document.getElementById('date');
    const accomplishmentCol = document.getElementById('accomplishment');
    const tableBody = document.getElementById('tableBody');
    for(const accomplishment of allAccomplishmentsObj){
        // get the date from accomplishment obj
        let dateOfAccomplishment = accomplishment.date;
        let month ;
        let day ;
        let year ;  
        let fullDate = dateOfAccomplishment.substring(0, 10);
        // get the content from accomplishment obj
        let contentOfAccomplishment = accomplishment.content;
        for(let i = 0; i < contentOfAccomplishment.length; i++){
            // create row of table
            const row = document.createElement('tr');
            // date of the accomplishemnt
            const dateElement = document.createElement('td');
            // content of the accomplishment
            const accomplishmentElement = document.createElement('td');
            // add the text
            dateElement.innerHTML = fullDate;
            accomplishmentElement.innerHTML = contentOfAccomplishment[i];
            // add them to the table
            tableBody.append(row);
            row.append(dateElement);
            row.append(accomplishmentElement);
        }
    }
}

window.onload = function(){
    loadAccomplishmentFromStorage();
}