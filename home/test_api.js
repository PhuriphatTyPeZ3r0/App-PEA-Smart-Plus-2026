const payload = {
  "pFTId": 6,
  "isManualLocation": false,
  "userMeterId": null,
  "ca": "020021750540",
  "peaNo": "",
  "contactName": "ผู้ใช้",
  "contactSurName": "ทดสอบ",
  "contactPhoneNo": "0800000000",
  "memo": "Testing API from Node.js (Fetch)",
  "fileAttachmentList": [],
  "lang": "TH"
};

const token = "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMyIsInBob25lX251bWJlciI6IjA4NTA3MDU1NTEiLCJpZGVudGl0eSI6InBmNmhYQWY3T2dhVjJ5aWh5dWhPcm5rSmN0Z0hpWkdRV1IzR3pvWT0iLCJkZXZpY2VfaWQiOiIxMDc4NSIsInRva2VuX2lkIjoiMTQzMDIiLCJleHAiOjE3NzQ2NTU5OTl9.S1RPRp9M8B2APP3H8wcUVcotq9o5T9shxhy3AGfuTU0GVCCYmo1-cA9q8mmrGhxFPJ51JjT5jDM4dA66PFjTPA";

async function test() {
  console.log("Sending request to https://smartplus3-api-dev.pea.co.th/API/Outage/SendReport...");
  try {
    const res = await fetch('https://smartplus3-api-dev.pea.co.th/API/Outage/SendReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Response Status:", res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log("Response JSON:", JSON.stringify(json, null, 2));
    } catch {
      console.log("Response Text (Not JSON):", text);
    }
  } catch (err) {
    console.error("Error Message:", err.message);
  }
}

test();
