const urlToPDF = "https://documentcloud.adobe.com/view-sdk-demo/PDFs/Summary.pdf";
const clientId = "9fb8a821e8dc430ba2bbbc35d14548ad";
const viewerOptions = {
    embedMode: "FULL_WINDOW",
    defaultViewMode: "FIT_PAGE",
    showDownloadPDF: false,
    showPrintPDF: false,
    showLeftHandPanel: false,
    showAnnotationTools: true
};

const saveOptions = {
    autoSaveFrequency: 0,
    enableFocusPolling: false,
    showSaveButton: true
}

function fetchPDF(urlToPDF) {
    return new Promise((resolve) => {
        fetch(urlToPDF)
            .then((resolve) => resolve.blob())
            .then((blob) => {
                resolve(blob.arrayBuffer());
            })
    })
}

function hideLink() {
    document.getElementById("getFile").style.display = "none";
}

function updateSaveUI(zipFileName) {
    document.getElementById("getFileText").innerHTML = "You can retrieve your saved file from: <a onclick='hideLink(); return true;'' href='https://practicalpdf.com/code-pens/reflect/uploads/" + zipFileName + "'>here.</a>";
    document.getElementById("getFile").style.display = "flex";
}

document.addEventListener("adobe_dc_view_sdk.ready", function () {
    // Create embedded view
    var adobeDCView = new AdobeDC.View({
        clientId: clientId,
        divId: "embeddedView"
    });


adobeDCView.registerCallback(
    AdobeDC.View.Enum.CallbackType.SAVE_API,
    function (metaData, content, options) {
        var uint8Array = new Uint8Array(content);
        var blob = new Blob([uint8Array], { type: 'application/pdf' });
        formData = new FormData();
        var pdfFilename = urlToPDF.split("/").slice(-1)[0];
        pdfFilename = pdfFilename.split(".")[0] + "-" + uuidv4() + ".pdf";
        formData.append('pdfFile', blob, pdfFilename);

        var zipFileName = pdfFilename.replace(".pdf", ".zip");

        fetch("https://practicalpdf.com/code-pens/reflect/", {
            method: 'POST',
            body: formData,
        })
            .then(
                function (response) {
                    if (response.status == 200) {
                        updateSaveUI(zipFileName);
                    }
                }
            )

        return new Promise((resolve, reject) => {
            resolve({
                code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                data: {
                    metaData: { fileName: urlToPDF.split("/").slice(-1)[0] }
                }
            });
        });
    },
    saveOptions
);



    // Show the file
    var previewFilePromise = adobeDCView.previewFile(
        {
            content: { promise: fetchPDF(urlToPDF) },
            metaData: { fileName: urlToPDF.split("/").slice(-1)[0] }
        },
        viewerOptions
    );

});

// Helper Functions:

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

(function () {
    if (Blob.arrayBuffer != "function") {
        Blob.prototype.arrayBuffer = myArrayBuffer;
    }

    function myArrayBuffer() {
        return new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.readAsArrayBuffer(this);
        });
    }
})();