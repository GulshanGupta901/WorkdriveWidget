var selectedRecord, selectedRecordId, publishedUrl = '', documentId = '', currentPageRecordId = '', currentModuleName = '', workdriveFolderId = '';
let folderId = '';
let accessToken ='';
let clientEmail = ''
let fileName = '';
let base64DataList = [];
let sharedWorkdriveFolderLen = 0;
let forWorkdrive = false;
let allUploadedAttachment = [];
const attachmentIcons = {
  pdf: "fas fa-file-pdf",
  excel: "fas fa-file-excel",
  word: "fas fa-file-word",
  image: "fas fa-file-image",
  default: "fas fa-file",
};



let selectedDocuments = [];
// Utility functions to reset and enable dropdowns
function resetDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '<option value="--None--">--None--</option>';
  dropdown.disabled = true;
  $(".select2").select2();
  document.getElementById('previewCoverLetter').disabled = true;
  document.getElementById("noAttachmentSection").style.display = "none";
  document.getElementById('previewCoverLetter').style.backgroundColor = "lightgray";
  document.getElementById('previewCoverLetter').style.color = "white";
  document.getElementById('previewCoverLetter').style.cursor = "no-drop";
  document.getElementById('previewCoverLetter').style.border = "lightgray";

  document.getElementById('previewCoverLetterAsPdf').disabled = true;
  document.getElementById('previewCoverLetterAsPdf').style.backgroundColor = "lightgray";
  document.getElementById('previewCoverLetterAsPdf').style.color = "white";
  document.getElementById('previewCoverLetterAsPdf').style.cursor = "no-drop";
  document.getElementById('previewCoverLetterAsPdf').style.border = "lightgray";

  document.getElementById('mergeAndSaveDocument').disabled = true;
  document.getElementById('mergeAndSaveDocument').style.backgroundColor = "lightgray";
  document.getElementById('mergeAndSaveDocument').style.color = "white";
  document.getElementById('mergeAndSaveDocument').style.border = "lightgray";
  document.getElementById('mergeAndSaveDocument').style.cursor = "no-drop";
}

function enableDropdown(dropdownId) {
  document.getElementById(dropdownId).disabled = false;
}

// Initialize dropdowns
resetDropdown("selectedModuleRecords");
resetDropdown("template_id_1");
ZOHO.embeddedApp.on("PageLoad",async function (data) {
  console.log("Page Loaded", data);
  currentPageRecordId = data.EntityId[0];
  currentModuleName = data.Entity;
  const access_tokenData = await ZOHO.CRM.FUNCTIONS.execute("accesstoken", {});
  ZOHO.CRM.API.getRecord({
    Entity: "Deals", RecordID:currentPageRecordId
   })
   .then(function(data){
    ZOHO.CRM.API.getRecord({
      Entity: "Accounts", RecordID:data.data[0].Account_Name.id
     })
     .then(function(accountData){
      console.log(JSON.stringify(accountData));
      clientEmail = accountData.data[0].Email;
     })
   })
    accessToken =  JSON.parse(access_tokenData.details.output).access_token;
  ZOHO.CRM.UI.Resize({ width: "1496", height: "1200" }).then(function (data) {
    console.log(data);
  });
});

// On changing module
$("#selectedRecord").on("change", function () {
  resetDropdown("selectedModuleRecords");
  resetDropdown("template_id_1");
  document.getElementById("attachmentSection").style.display = "none";
  selectedDocuments = [];
  selectedRecord = document.getElementById("selectedRecord").value;
  console.log("Selected Module:", selectedRecord);
  if (selectedRecord !== "--None--" && selectedRecord == 'Deals') {
    enableDropdown("selectedModuleRecords");
    ZOHO.CRM.API.getRecord({
      Entity: selectedRecord, RecordID: currentPageRecordId
    })
      .then(function (data) {
        $("#selectedModuleRecords").append(
          `<option value="${data.data[0].id}" data-workdriveId="${data.data[0].Workdrive_Id}" data-sharedWorkdriveId="${data.data[0].Shared_Workdrive}"> ${data.data[0].Deal_Name}</option>`
        );
        $(".select2").select2();
      })
  }
  if (selectedRecord !== "--None--" && selectedRecord != 'Deals') {
    enableDropdown("selectedModuleRecords");
    ZOHO.CRM.API.getRelatedRecords({
      Entity: currentModuleName,
      RecordID: currentPageRecordId,
      sort_order: "asc",
      RelatedList: selectedRecord,
      per_page: 200,
      page: 1,
    }).then(function (data) {
      console.log("Records:", JSON.stringify(data));
      if (data.data && data.data.length > 0) {
        data.data.forEach(function (ele) {
          if (selectedRecord === "Submittals") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Name}</option>`
            );
          } else if (selectedRecord === "RFIs") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Name}</option>`
            );
          } else if (selectedRecord === "Project_Change_Orders") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Name}</option>`
            );
          } else if (selectedRecord === "Project_Address") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Name}</option>`
            );
          } else if (selectedRecord === "Subcontractors13") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Name}</option>`
            );
          } else if (selectedRecord === "Quotes") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Quote_Number}</option>`
            );
          } else if (selectedRecord === "Bills") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Invoice_Number}</option>`
            );
          } else if (selectedRecord === "Purchase_Orders") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Name}</option>`
            );
          } else if (selectedRecord === "Vendors18") {
            $("#selectedModuleRecords").append(
              `<option value="${ele.id}" data-workdriveId="${ele.Workdrive_Id}" data-sharedWorkdriveId="${ele.Shared_Workdrive}">${ele.Vendor_Name}</option>`
            );
          }
        });
        $(".select2").select2();
      }
    });
  }
});
$(document).ready(function () {
  // Initialize Select2 on the dropdown
  $('#selectedModuleRecords').select2({
    placeholder: "Search Templates",
    allowClear: true
  });

  // Use the 'select2:open' event to handle search term dynamically
  $('#selectedModuleRecords').on('select2:open', function () {
    // Ensure we attach the event after Select2 opens
    $('.select2-search__field').on('input', async function () {
      var searchTerm = $(this).val();
      console.log("Typing: " + searchTerm);
      const response = await fetchData(`https://www.zohoapis.com/crm/v7/Deals`);
      console.log('response::' + response);
    });
  });

});
$("#template_id_1").on("change", function () {
  document.getElementById("spinner").style.display = "flex";
  document.getElementById("spinner-overlay").style.display = "block";
  document.getElementById("iframeAndButtonContainer").style.display = "none";

  const selectedTemplate = document.getElementById("template_id_1").value;
  const iframeContainer = document.getElementById('iframeContainer');
  var func_name = "mergedocument";
  var req_data = {
    "arguments": JSON.stringify({
      "resource_id": selectedTemplate,
      "moduleName": selectedRecord,
      "RecordId": document.getElementById("selectedModuleRecords").value
    })
  };
  ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
    .then(function (data) {
      console.log(JSON.stringify(data));
      if (data && data.details && data.details.output) {
        publishedUrl = JSON.parse(data.details.output).published_url;
        documentId = JSON.parse(data.details.output).document_id;
        document.getElementById("spinner").style.display = "none";
        document.getElementById("spinner-overlay").style.display = "none";
        document.getElementById('previewCoverLetter').disabled = false;
        document.getElementById('previewCoverLetter').style.backgroundColor = "white";
        document.getElementById('previewCoverLetter').style.color = "black";
        document.getElementById('previewCoverLetter').style.cursor = "pointer";
        document.getElementById('previewCoverLetter').style.border = "2px solid #04AA6D";

        document.getElementById('previewCoverLetterAsPdf').disabled = false;
        document.getElementById('previewCoverLetterAsPdf').style.backgroundColor = "white";
        document.getElementById('previewCoverLetterAsPdf').style.color = "black";
        document.getElementById('previewCoverLetterAsPdf').style.cursor = "pointer";
        document.getElementById('previewCoverLetterAsPdf').style.border = "2px solid purple";

        document.getElementById('mergeAndSaveDocument').disabled = false;
        document.getElementById('mergeAndSaveDocument').style.backgroundColor = "white";
        document.getElementById('mergeAndSaveDocument').style.color = "black";
        document.getElementById('mergeAndSaveDocument').style.border = "2px solid #008CBA";
        document.getElementById('mergeAndSaveDocument').style.cursor = "pointer";


      }
    })
})

async function binaryToBase64(blob) {
  try {
    // Create a FileReader to convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Get the base64 string by removing the Data URL prefix
        const base64String = reader.result
          .replace('data:', '')
          .replace(/^.+,/, '');
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting blob to base64:', error);
    throw error;
  }
}

// On changing record
//https://workdrive.zoho.com/file/uvh2j2d4a6a9be5fe48f5a81149ae841ed9e5
$("#selectedModuleRecords").on("change", async function () {
  console.log('selectedModuleRecords::');
  resetDropdown("template_id_1");
//   const data = await ZOHO.CRM.FUNCTIONS.execute("accesstoken", {});
// console.log('data::'+JSON.parse(data.details.output).access_token);
//   fetch('https://download.zoho.com/v1/workdrive/download/uvh2j2d4a6a9be5fe48f5a81149ae841ed9e5',{
//     headers: {
//     'Authorization': `Zoho-oauthtoken ${JSON.parse(data.details.output).access_token}`
//   }}).then(response=>{
//     console.log(response);
    
//   })
  // ZOHO.CRM.CONNECTION.invoke("zohoconnection", {
  //   "method": "GET",
  //   "url": "https://download.zoho.com/v1/workdrive/download/8ff1c81047997701d4f4abca16c1644d6dc41"
  // }).then(async function (data) {
  //   console.log(data);
  //   console.log(btoa(unescape(encodeURIComponent(data))));
  //   // console.log(Base64.btoa(data));
  //   console.log(Base64.encode(data));
  //   console.log(Base64.encodeURI(data));
  //   const binaryBlob = new Blob([data], { type: 'application/pdf' });
  //   const base64PDF = await binaryToBase64(binaryBlob);
  //   console.log(base64PDF);
  // });
  document.getElementById("selectedDocumentsSection").style.display = 'none';

  ZOHO.CRM.CONNECTION.invoke("zohoconnection", {
    "method": "GET",
    "url": "https://www.zohoapis.com/crm/v2/settings/templates?type=mailmerge&module=" + selectedRecord
  }).then(function (data) {
    console.log(JSON.stringify(data));
    console.log('selectedRecord' + selectedRecord);
    templates = data.details.statusMessage.templates;
    $('#template_id_1').empty();
    $("#template_id_1").append('<option value="None">--None--</option>');
    templates.forEach(function (ele) {
      $("#template_id_1").append('<option value="' + ele.resource_id + '">' + ele.name + '</option>');
    });
    $(".select2").select2();
  });

  document.getElementById("attachmentSection").style.display = "none";
  selectedDocuments = [];
  document.getElementById("template_id_1").disabled = false;
  selectedRecordId = document.getElementById("selectedModuleRecords").value;
  console.log("Selected Record ID:", selectedRecordId);

  if (selectedRecordId !== "--None--") {
    if (selectedRecord == 'Subcontractors13') {
      selectedRecord = 'Subcontractors'
    } else if (selectedRecord == 'Project_Address') {
      selectedRecord = 'Daily_Work_Reports'
    } else if (selectedRecord == 'Project_Change_Orders') {
      selectedRecord = 'Change_Orders'
    } else if (selectedRecord == 'Purchase_Orders') {
      selectedRecord = 'Purchase_Orders1'
    } else if (selectedRecord == 'Vendors18') {
      selectedRecord = 'Vendors'
    }
    let count = 0;
    var selectedOption = document.getElementById("selectedModuleRecords").options[document.getElementById("selectedModuleRecords").selectedIndex];
    console.log(selectedOption.getAttribute('data-workdriveId'));
    ZOHO.CRM.CONNECTION.invoke("zohoconnection", {
      "method": "GET",
      "headers": { "Accept": "application/vnd.api+json" },
      "url": "https://www.zohoapis.com/workdrive/api/v1/files/" + selectedOption.getAttribute('data-workdriveId') + "/files"
    }).then(function (data) {
      console.log(JSON.stringify(data));
      const attachmentList = document.getElementById("attachmentList");
      document.getElementById("noAttachmentSection").style.display = "none";
      const selectedList = document.getElementById("selectedList");
      attachmentList.innerHTML = ""; // Clear previous attachments

      if (data.details && data.details.statusMessage && data.details.statusMessage.data.length > 0) {
        selectedList.innerHTML = "";
        data.details.statusMessage.data.forEach((doc, index) => {
          if (doc.attributes.extn == 'pdf') {
            const li = document.createElement("li");

            // Icon
            const icon = document.createElement("i");
            icon.className =
              attachmentIcons[doc.attributes.extn] || attachmentIcons["default"];
            icon.classList.add("attachment-icon");

            // Name
            const name = document.createElement("span");
            name.className = "attachment-name";
            name.textContent = doc.attributes.name;

            // Append to the list item
            li.appendChild(icon);
            li.appendChild(name);
            li.dataset.index = index;

            // Add click event for selection
            li.addEventListener("click", () => {
              if (li.classList.contains("selected")) {
                li.classList.remove("selected");
                console.log(selectedDocuments);
                const index = selectedDocuments.findIndex(
                  (document) => document.attributes.name === doc.attributes.name
                );
                if (index > -1) selectedDocuments.splice(index, 1);
              } else {
                li.classList.add("selected");
                selectedDocuments.push(doc);
              }
            });
            attachmentList.appendChild(li);
            count = count + 1;
          }
        });
        if(count > 0){
        document.getElementById("attachmentSection").style.display = "block";
        }

      } else {
        document.getElementById("attachmentSection").style.display = "none";
        document.getElementById("noAttachmentSection").style.display = "block";

      }
    });

    var workdriveId = document.getElementById("selectedModuleRecords").options[document.getElementById("selectedModuleRecords").selectedIndex];
    ZOHO.CRM.CONNECTION.invoke("zohoconnection", {
      "method": "GET",
      "headers": { "Accept": "application/vnd.api+json" },
      "url": "https://www.zohoapis.com/workdrive/api/v1/files/" + workdriveId.getAttribute('data-sharedWorkdriveId') + "/files"
    }).then(function (data) {

      if (data.details && data.details.statusMessage && data.details.statusMessage.data.length > 0) {
        sharedWorkdriveFolderLen = data.details.statusMessage.data.length;
      }
  });
  }
});

document
  .getElementById("showSelectedButton")
  .addEventListener("click", () => {
    const selectedDocumentsSection = document.getElementById("selectedDocumentsSection");
    if (selectedDocuments.length === 0) {
      showPopup('Please select at least one document.', 'error');
      
      return;
    }
    renderSelectedList();
    selectedDocumentsSection.style.display = "block";
  });
//remove selected attachment
function removeAttachment(attachmentId) {
  const attachmentElement = document.getElementById(`selected_attachment_${attachmentId}`);
  attachmentElement.parentElement.removeChild(attachmentElement);
}
//display selected attachment in the seperate section
function renderSelectedList() {
  selectedList.innerHTML = "";
  selectedDocuments.forEach((doc, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", true);
    li.dataset.index = index;

    const icon = document.createElement("i");
    icon.className =
      attachmentIcons[doc.attributes.extn] || attachmentIcons["default"];
    icon.classList.add("attachment-icon");

    const name = document.createElement("span");
    name.className = "attachment-name";
    name.setAttribute("Value", doc.id);
    name.setAttribute("data-fileId", doc.id);

    name.textContent = doc.attributes.name;

    li.appendChild(icon);
    li.appendChild(name);

    // Drag-and-Drop Events
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.dataset.index);
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
      li.style.border = "2px dashed #007bff";
    });

    li.addEventListener("dragleave", () => {
      li.style.border = "1px solid #ddd";
    });

    li.addEventListener("drop", (e) => {
      e.preventDefault();
      li.style.border = "1px solid #ddd";

      const draggedIndex = e.dataTransfer.getData("text/plain");
      const droppedIndex = e.target.dataset.index;

      if (draggedIndex === droppedIndex) return;

      const draggedItem = selectedDocuments.splice(draggedIndex, 1)[0];
      selectedDocuments.splice(droppedIndex, 0, draggedItem);

      renderSelectedList(); // Re-render list
    });

    selectedList.appendChild(li);
  });
}
//merge pdf 
// document.getElementById("mergeButton").addEventListener("click", async () => {
//   document.getElementById("messageForFileUpload").style.display = "none";
//   document.getElementById("mergeButton").innerHTML = 'Please Wait...';

//   let base64DataList = [];
//   const selectedList = document.getElementById("selectedList");
//   const listItems = selectedList.querySelectorAll("li");
//   let attachmentIds = Array.from(listItems).map(li => li.querySelector(".attachment-name").getAttribute("data-fileid")).join(',');

//   await executeSequentially(attachmentIds, base64DataList);
// });

// async function executeSequentially(attachmentIds, base64DataList,forWorkdrive) {
//   try {
//     const func_name = "mergedocumentandattach";
//     const req_data = {
//       "arguments": JSON.stringify({
//         "documentId": attachmentIds,
//         "Module": selectedRecord,
//         "RecordId": document.getElementById("selectedModuleRecords").value,
//         "forWorkrive": forWorkdrive
//       })
//     };
//     const data = await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data);

//     if (data.details && data.details.output) {
//       const uploadedAttachmentsId = data.details.output.split(",");
//       const attachmentData = await ZOHO.CRM.CONNECTION.invoke("zohoconnection", {
//         "method": "GET",
//         "url": `https://www.zohoapis.com/crm/v2/${selectedRecord}/${document.getElementById("selectedModuleRecords").value}/Attachments`
//       });

//       const attachmentDataMap = new Map();
//       attachmentData.details.statusMessage.data.forEach(attachment => {
//         attachmentDataMap.set(attachment.id, attachment.$file_id);
//       });

//       for (const attachmentId of uploadedAttachmentsId) {
//         if (attachmentDataMap.has(attachmentId)) {
//           allUploadedAttachment.push(attachmentId);
//           const fileId = attachmentDataMap.get(attachmentId);
//           await processFile(fileId, base64DataList);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }


// async function processFile(fileId, base64DataList) {
//   const fileData = await ZOHO.CRM.API.getFile({ id: fileId });

//   if (fileData instanceof Blob) {
//     const reader = new FileReader();
//     reader.onloadend = async function (e) {
//       const result = e.target.result;
//        if (result.includes('application/pdf')) {
//         console.log('base64DataList::'+base64DataList.length);
//         if(forWorkdrive){
//         base64DataList.push(result.split(',')[1]);
//         }else{
//         base64DataList.unshift(result.split(',')[1]);
//         }
//       }
//       checkAndGeneratePDF(base64DataList);
//     };
//     reader.readAsDataURL(fileData);
//   }
// }

// function checkAndGeneratePDF(base64DataList) {
//   console.log(base64DataList.length);
//   console.log(document.getElementById("selectedList").querySelectorAll("li").length);
//   console.log('forWorkdrive::'+forWorkdrive);

//   if(forWorkdrive){
//   if (base64DataList.length === document.getElementById("selectedList").querySelectorAll("li").length) {
//     generatePDF(base64DataList);
//   }
// }else{
//   if (base64DataList.length === (document.getElementById("selectedList").querySelectorAll("li").length)+1) {
//     generatePDF(base64DataList);
//   }
// }
// }


async function generatePDF(base64DataList) {
  console.log('generatePDF');

  if (base64DataList.length > 0) {
    console.log('ismde');
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();

    for (const base64Data of base64DataList) {
      const pdfData = atob(base64Data);
      const existingPdfBytes = new Uint8Array(pdfData.length);

      for (let i = 0; i < pdfData.length; i++) {
        existingPdfBytes[i] = pdfData.charCodeAt(i);
      }

      const pdfToMerge = await PDFDocument.load(existingPdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());

      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const pdfBytes = await mergedPdf.save();
    var workdriveId = document.getElementById("selectedModuleRecords").options[document.getElementById("selectedModuleRecords").selectedIndex];
  console.log('generatePDF'+workdriveId);
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    console.log(blob);
    const formData = new FormData();
    formData.append('file', blob, fileName+` V${sharedWorkdriveFolderLen}.pdf`); // Append file with name
    formData.append('parent_id', workdriveId.getAttribute('data-sharedWorkdriveId'));

    const response = await fetch('https://mailmergeandworkdrive-1.onrender.com/upload', {
      method: 'POST',
      body: formData,
  });

  const result = await response.json();
  console.log('File uploaded successfully:', result);
  if(result.folderId !=null && result.folderId !='' && result.folderId !=undefined){
    base64DataList.shift();
   document.getElementById("spinner").style.display = "none";
   document.getElementById("spinner-overlay").style.display = "none";
   const allOtherSections = document.querySelectorAll("body > div:not(#iframeContainerForMergedFile)");
   document.getElementById("iframeContainerForMergedFile").style.display = "block";
   allOtherSections.forEach(section => section.style.display = "none");
   
   document.getElementById("ContainerForMergedFile").innerHTML = '';
   const iframe = document.createElement('iframe');
     iframe.src = "https://workdrive.zohoexternal.com/file/"+result.folderId ; 
     iframe.width = "100%";
     iframe.height = "1000px";
     iframe.style.border = "1px solid #ccc";
     document.getElementById("ContainerForMergedFile").appendChild(iframe);
 }
  } else {
    showPopup('Please upload at least one valid PDF file.', 'error');
  }
}



//Merge and Save
document.getElementById("mergeAndSaveDocument").addEventListener("click", async () => {
  document.getElementById('emailModal').style.display = 'flex';
  document.getElementById("toAddress").value = clientEmail;
  if(document.getElementById("customMessageCheckbox").checked == true){
    document.getElementById("emailMessage").innerHTML = `Hello, We have shared a document with you in attachment.`;
    if(folderId !=''){
      document.getElementById("emailMessage").innerHTML = `Hello, We have shared a document with you in attachment and This is attached link of the documents https://workdrive.zohoexternal.com/file/${folderId}`
    }
  }else{
    document.getElementById("emailMessage").innerHTML = `Hello, We have shared a document link with you please have a look. Here is your Cover Letter https://writer.zohopublic.com/writer/published/${documentId}`;
    if(folderId !=''){
      document.getElementById("emailMessage").innerHTML = `Hello, Please find your file and click here to access your file https://workdrive.zohoexternal.com/file/${folderId}. Thank you.`;
    }
  } 
  // var func_name = "sendmailmerge";
  // document.getElementById("mergeAndSaveDocument").innerHTML = 'Please wait...';
  // console.log('folderId+'+folderId);
  // var req_data = {
  //   "arguments": JSON.stringify({
  //     "ModuleName": selectedRecord,
  //     "id": document.getElementById("selectedModuleRecords").value,
  //     "documentId": documentId,
  //     "folderId": folderId
  //   })
  // };
  // ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
  //   .then(function (data) {
  //     console.log(data);
  //     document.getElementById("mergeAndSaveDocument").innerHTML = 'Save and Send';

  //     if (data.details && data.details.output) {
  //       if (data.details.output == 'Document has been send successfully.') {
  //         showPopup('Document has been send successfully.', 'success');
  //       } else if (data.details.output.includes('There is no email address associated with customer')) {
  //         showPopup(data.details.output, 'error');
  //       }
  //       else {
  //         showPopup('Something went wrong, please refresh the page and try again.', 'error');
  //       }
  //     }
  //   })
});

//Onchnage on the checkbox
document.getElementById("customMessageCheckbox").addEventListener("change",()=>{
  if(document.getElementById("customMessageCheckbox").checked == true){
    document.getElementById("emailMessage").innerHTML = `Hello, We have shared a document with you in attachment.`;
    if(folderId !=''){
      document.getElementById("emailMessage").innerHTML = `Hello, We have shared a document with you in attachment and This is attached link of the documents https://workdrive.zohoexternal.com/file/${folderId}`
    }
  }else{
    document.getElementById("emailMessage").innerHTML = `Hello, We have shared a document link with you please have a look. Here is your Cover Letter https://writer.zohopublic.com/writer/published/${documentId}`;
    if(folderId !=''){
      document.getElementById("emailMessage").innerHTML = `Hello, Please find your file and click here to access your file https://workdrive.zohoexternal.com/file/${folderId}. Thank you.`
    }
  } 
})
//Send Email
// Event listener for the Send Email button
document.getElementById("sendEmail").addEventListener("click", () => {
  // Get form field values
  const toAddress = document.getElementById("toAddress").value;
  const ccAddress = document.getElementById("ccAddress").value;
  const bccAddress = document.getElementById("bccAddress").value;
  const emailSubject = document.getElementById("emailSubject").value;
  const customMessageCheckbox = document.getElementById("customMessageCheckbox").checked;
// let message ='';
//   if(customMessageCheckbox == true){
//     message = `Hello , We have shared a document with you in attachment.`;
//     if(folderId !=''){
//       message = `Hello , We have shared a document with you in attachment and This is attached link of the documents https://workdrive.zohoexternal.com/file/${folderId}`
//     }
//   }else{
//     message = `Hello , We have shared a document link with you please have a look. Here is your Cover Letter https://writer.zohopublic.com/writer/published/${documentId}`;
//     if(folderId !=''){
//       message = `Hello , We have shared a document link with you please have a look. Here is your Cover Letter https://writer.zohopublic.com/writer/published/${documentId} and This is attached link of the documents https://workdrive.zohoexternal.com/file/${folderId}`
//     }
//   }
  
  if (!toAddress.trim()) {
    showPopup("The 'To address' field is required.","error");
    return;
  }

  const emailData = {
    ccAddress,
    bccAddress,
    emailSubject
  };

  console.log("Email Data:", emailData);
var func_name = "sendmailmerge";
  document.getElementById("sendEmail").innerHTML = 'Please wait...';
  console.log('folderId+'+folderId);
  var req_data = {
    "arguments": JSON.stringify({
      "ModuleName": selectedRecord,
      "id": document.getElementById("selectedModuleRecords").value,
      "documentId": documentId,
      "folderId": folderId,
      "replyTo":toAddress,
      "ccAddress":ccAddress,
      "bccAddress":bccAddress,
      "emailSubject":emailSubject,
      "isChecked":customMessageCheckbox,
      "Message": document.getElementById("emailMessage").value
    })
  };
  ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
    .then(function (data) {
      console.log(data);
      if(data.code == "success"){
        document.getElementById("emailModal").style.display = "none";
        showPopup('Document has been send successfully','success');
        // document.getElementById("toAddress").value='';
  document.getElementById("sendEmail").innerHTML = 'Send Email';

  document.getElementById("ccAddress").value='';
   document.getElementById("bccAddress").value='';
  document.getElementById("emailSubject").value='Merged Document';
   document.getElementById("customMessageCheckbox").checked='';
   document.getElementById("emailMessage").innerHTML='';

      }
    })

});

// Event listener for the Cancel button
document.getElementById("closeModal").addEventListener("click", () => {
  // Close the modal or reset the form
  document.getElementById("emailModal").style.display = "none";
});

//Convert ZIP to PDF
function base64ToBinary(base64) {
  const binaryString = atob(base64);
  const byteArray = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray.buffer;
}
//Preview Cover Letter
 function previewCoverLetter() {
  // Clear any existing iframe
  document.getElementById("spinner").style.display = "flex";
  document.getElementById("spinner-overlay").style.display = "block";
  document.getElementById("iframeAndButtonContainer").style.display = "none";
  let allOtherSections = ''
  if(folderId !='' && folderId !=undefined){
   allOtherSections = document.querySelectorAll("body > div:not(#iframeAndButtonContainer):not(#ContainerForMergedFileInsidePreview)");
  }else{
   allOtherSections = document.querySelectorAll("body > div:not(#iframeAndButtonContainer)");
  }

  setTimeout(() => {
    iframeContainer.innerHTML = '';
    document.getElementById("spinner").style.display = "none";
    document.getElementById("spinner-overlay").style.display = "none";

    document.getElementById("iframeAndButtonContainer").style.display = "block";
    allOtherSections.forEach(section => section.style.display = "none");
    document.getElementById("editbuttonAnchor").href = 'https://writer.zoho.com/writer/open/' + documentId;
    const iframe = document.createElement('iframe');
    iframe.src = publishedUrl; // Update with actual template URL
    iframe.width = "100%";
    iframe.height = "1000px";
    iframe.style.border = "1px solid #ccc";
    iframeContainer.appendChild(iframe);
   
  }, 10000)
}
async function previewCoverLetterAsPdf() {
  let base64DataList = [];
  const selectedList = document.getElementById("selectedList");
  const listItems = selectedList.querySelectorAll("li");
  let attachmentIds = Array.from(listItems).map(li => li.querySelector(".attachment-name").getAttribute("data-fileid"));
  
  console.log('attachmentIds::', attachmentIds);

  // Use Promise.all to wait for all requests to finish
  const fetchPromises = attachmentIds.map(async (eachId) => {
    console.log('Fetching file for ID:', eachId);
    const response = await fetch('https://mailmergeandworkdrive-1.onrender.com/workdriveFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ 
        fileId: eachId,
        accessToken: accessToken
      }),
    });

    const result = await response.json();
    console.log('File fetched successfully:', result);
    return result.base64String; // Return the base64 string for Promise.all
  });

  // Wait for all fetch calls to complete
  base64DataList = await Promise.all(fetchPromises);

  console.log('base64DataList.length:', base64DataList.length);
  console.log('Expected length:', listItems.length);

  if (base64DataList.length === listItems.length) {
    const writerResponse = await fetch('https://mailmergeandworkdrive-1.onrender.com/writerFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({  
        fileId: documentId,
        accessToken: accessToken
      }),
    });

    const result = await writerResponse.json();
    console.log('Writer file fetched successfully:', result);

    // Add writer file at the beginning
    base64DataList.unshift(result.base64String);

    console.log('Final base64DataList:', base64DataList);
    
    generatePDF(base64DataList);
  }
}

//Preview Merged File Only
// document.getElementById("PreviewButton").addEventListener("click",function(){
//   // Clear any existing iframe
//   document.getElementById("spinner").style.display = "flex";
//   document.getElementById("spinner-overlay").style.display = "block";
//   const allOtherSections = document.querySelectorAll("body > div:not(#iframeContainerForMergedFile)");
//   document.getElementById("iframeContainerForMergedFile").style.display = "block";
//   allOtherSections.forEach(section => section.style.display = "none");
  
//   document.getElementById("ContainerForMergedFile").innerHTML = '';
//   const iframe = document.createElement('iframe');
//     iframe.src = "https://workdrive.zohoexternal.com/file/"+folderId; 
//     iframe.width = "100%";
//     iframe.height = "1000px";
//     iframe.style.border = "1px solid #ccc";
//     document.getElementById("ContainerForMergedFile").appendChild(iframe);
// });


// Close iframe and show other sections
document.getElementById("closeIframe").addEventListener("click", function () {
  document.getElementById("iframeAndButtonContainer").style.display = "none";
  document.getElementById("iframeContainerForMergedFile").style.display = "none";
  document.getElementById("spinner-overlay").style.display = "none";

  document.querySelectorAll("body > div:not(#iframeAndButtonContainer):not(#spinner):not(#popup):not(#spinner-overlay):not(#popupOverlay):not(#iframeContainerForMergedFile):not(#ContainerForMergedFileInsidePreview):not(#emailModal)").forEach(section => section.style.display = "block");

});
// Close iframe and show other sections
document.getElementById("closeIframeForMailMerge").addEventListener("click", function () {
  document.getElementById("iframeContainerForMergedFile").style.display = "none";
  document.getElementById("spinner-overlay").style.display = "none";

  document.querySelectorAll("body > div:not(#iframeAndButtonContainer):not(#spinner):not(#popup):not(#spinner-overlay):not(#popupOverlay):not(#iframeContainerForMergedFile):not(#ContainerForMergedFileInsidePreview):not(#emailModal)").forEach(section => section.style.display = "block");

});
document.getElementById("refreshButton").addEventListener("click", () => {
  iframeContainer.innerHTML = '';
  document.getElementById("spinner").style.display = "none";
  document.getElementById("spinner-overlay").style.display = "none";

  document.getElementById("iframeAndButtonContainer").style.display = "block";
  const allOtherSections = document.querySelectorAll("body > div:not(#iframeAndButtonContainer)");
  allOtherSections.forEach(section => section.style.display = "none");
  document.getElementById("editbuttonAnchor").href = 'https://writer.zoho.com/writer/open/' + documentId;
  const iframe = document.createElement('iframe');
  iframe.src = publishedUrl; // Update with actual template URL
  iframe.width = "100%";
  iframe.height = "1000px";
  iframe.style.border = "1px solid #ccc";
  iframeContainer.appendChild(iframe);
})


//Popup for success and error for send and save
function showPopup(message, type) {
  const popup = document.getElementById('popup');
  const messageElement = document.getElementById('popup-message');

  // Set message text
  messageElement.textContent = message;

  // Remove existing classes and add the appropriate one
  popup.className = 'popup'; // Reset classes
  popup.classList.add(type); // Add success or error class
  if (type == 'error') {
    popup.style.width = '503px';
  }

  // Show popup
  popup.style.display = 'block';

  // Automatically close the popup after 4 seconds
  setTimeout(() => {
    popup.style.display = 'none';
  }, 4000); // 4000 milliseconds = 4 seconds
}

//close popup
function closePopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

//File Name popup

const mergeButton = document.getElementById('previewCoverLetterAsPdf');
const popupOverlay = document.getElementById('popupOverlay');
const popupInput = document.getElementById('popupInput');
const popupSubmit = document.getElementById('popupSubmit');
const popupClose = document.getElementById('popupClose');

mergeButton.addEventListener('click', () => {
  popupOverlay.style.display = 'block';
});

// Close the popup when "X" is clicked
popupClose.addEventListener('click', () => {
  popupOverlay.style.display = 'none';
});
popupClose.addEventListener('click', () => {
  popupOverlay.style.display = 'none';
});
popupSubmit.addEventListener('click', async () => {
  fileName = popupInput.value.trim();
 if (fileName !='') {
   console.log('inside');
   popupOverlay.style.display = 'none';
   const popupInput = document.getElementById('popupInput');
   popupInput.value = '';
   document.getElementById("spinner").style.display = "flex";
 document.getElementById("spinner-overlay").style.display = "block";
 try {
   await previewCoverLetterAsPdf();
} catch (error) {
   console.error('Error previewing PDF:', error);
}
 //   popupOverlay.style.display = 'none'; 
 //   const popupInput = document.getElementById('popupInput');
 //   popupInput.value = '';
 //   if(fileName !=''){
 //     document.getElementById("messageForFileUpload").style.display = "none";
 //     document.getElementById("mergeButton").innerHTML = 'Please Wait...';

 //  base64DataList = [];
 //    const selectedList = document.getElementById("selectedList");
 //    const listItems = selectedList.querySelectorAll("li");
 //    let attachmentIds = Array.from(listItems).map(li => li.querySelector(".attachment-name").getAttribute("data-fileid")).join(',');
 //   await executeSequentially(attachmentIds, base64DataList,  forWorkdrive = true);
 //   }
 } else {
   showPopup('Please enter a file name!', 'error');
 }
});
ZOHO.embeddedApp.init();