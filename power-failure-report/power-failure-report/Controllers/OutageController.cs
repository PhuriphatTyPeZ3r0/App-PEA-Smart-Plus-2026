using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PEASmartPlus3.Models;
using System.Threading.Tasks;

namespace PEASmartPlus3.Controllers
{
/// <summary>
/// Controller สำหรับจัดการ API แจ้งไฟฟ้าขัดข้อง (Power Failure)
/// </summary>
    // [Authorize] // ตรวจสอบ Bearer accessToken (ปิดไว้ชั่วคราวเพื่อเทส)
    [ApiController]
    [Route("API/[controller]")]
    [Produces("application/json")]
    public class OutageController : ControllerBase
    {
        // สามารถ Inject Service สำหรับจัดการ Business Logic เข้ามาได้ เช่น IOutageService
        public OutageController()
        {
        }

        /// <summary>
        /// 1. ดึงข้อมูลประเภทไฟฟ้าขัดข้อง (Outage Type)
        /// </summary>
        /// <remarks>
        /// ใช้สำหรับดึงรายการประเภทการแจ้งเตือนเพื่อแสดงใน Dropdownlist
        /// </remarks>
        /// <param name="request">ระบุภาษา เช่น "TH" หรือ "EN"</param>
        /// <returns>รายการประเภทไฟฟ้าขัดข้อง</returns>
        [HttpPost("OutageType")]
        [ProducesResponseType(typeof(BaseResponse<OutageTypeResponse[]>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetOutageType([FromBody] OutageTypeRequest? dto)
        {
            // TODO: เรียก Stored Procedure spGetOutageType
            return Ok(new
            {
                success = true,
                code = "200",
                message = "Success",
                outageTypeList = new object[] { } // คืนค่าเป็น List ของ OutageTypeResponse
            });
        }

        /// <summary>
        /// 2. อัปโหลดไฟล์รูปภาพหรือเอกสาร (Upload File)
        /// </summary>
        /// <remarks>
        /// รับไฟล์จาก Client (Base64) -> สร้างชื่อไฟล์ชั่วคราว -> Upload ไป S3 -> ส่ง key กลับ\nไฟล์ที่รองรับ: .pdf, .tiff, .jpeg, .jpg, .png, .mp4, .doc, .docx, .xls, .xlsx (ขนาดไม่เกิน 5MB)
        /// </remarks>
        [HttpPost("Upload")]
        [ProducesResponseType(typeof(BaseResponse<UploadResponse>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadFile([FromBody] UploadRequest request)
        {
            // TODO: ตรวจสอบประเภทไฟล์ (.pdf, .jpg ฯลฯ), ตรวจสอบขนาดไม่เกิน 5MB
            // TODO: สร้างชื่อไฟล์ชั่วคราว และอัปโหลดขึ้น S3
            return Ok(new BaseResponse<UploadResponse>
            {
                Success = true,
                Code = "200",
                Message = "Success",
                Result = new UploadResponse()
            });
        }

        /// <summary>
        /// 3. ลบไฟล์แนบชั่วคราว (Delete File)
        /// </summary>
        /// <remarks>
        /// ลบไฟล์ที่อัปโหลดไว้ใน S3 Temp Storage ตาม s3key ที่ระบุ
        /// </remarks>
        [HttpPost("DeleteFile")]
        [ProducesResponseType(typeof(BaseResponse<object>), 200)]
        public async Task<IActionResult> DeleteFile([FromBody] DeleteFileRequest request)
        {
            // TODO: ลบ Object ออกจาก S3 ตาม S3Key ที่ส่งมา
            return Ok(new { success = true, code = "200", message = "Success" });
        }

        /// <summary>
        /// 4. บันทึกข้อมูลการแจ้งไฟฟ้าขัดข้อง (Send Report)
        /// </summary>
        /// <remarks>
        /// บันทึกข้อมูลการแจ้งเหตุของผู้ใช้งานลงฐานข้อมูล และส่งข้อมูลต่อไปยังระบบ OMS
        /// </remarks>
        [HttpPost("SendReport")]
        [ProducesResponseType(typeof(BaseResponse<SendReportResponse>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> SendReport([FromBody] SendReportRequest request)
        {
            // TODO: ตรวจสอบ Mandatory Fields
            // TODO: เรียก API cs-service.pea.co.th/api/customer/list/caAddress
            // TODO: เรียก API gis.pea.co.th เพื่อดึง lat, long
            // TODO: EXEC spAddOutageReport ลงฐานข้อมูล
            // TODO: ย้ายไฟล์จาก temp ไป upload บน S3

            return Ok(new BaseResponse<SendReportResponse>
            {
                Success = true,
                Code = "200",
                Message = "Success",
                Result = new SendReportResponse { PFId = 1 }
            });
        }

        /// <summary>
        /// 5. ดึงประวัติการแจ้งไฟฟ้าขัดข้อง (History)
        /// </summary>
        /// <remarks>
        /// ดึงรายการประวัติที่ผู้ใช้งานเคยแจ้งไว้ รองรับการทำ Paging โดยส่ง pFIdIndex ของรายการสุดท้ายมา
        /// </remarks>
        [HttpPost("History")]
        [ProducesResponseType(typeof(BaseResponse<HistoryResponse[]>), 200)]
        public async Task<IActionResult> GetHistory([FromBody] HistoryRequest request)
        {
            // TODO: เรียก Stored Procedure spGetOutageReport
            return Ok(new
            {
                success = true,
                code = "200",
                message = "Success",
                reportList = new object[] { } // คืนค่า List ของ HistoryResponse
            });
        }

        /// <summary>
        /// 6. ดึงรายละเอียดการแจ้งไฟฟ้าขัดข้อง (Detail)
        /// </summary>
        /// <remarks>
        /// ดึงข้อมูลรายละเอียดแบบเจาะจงรายรายการ (รวมถึงสถานะการแก้ไข และไฟล์แนบ) ด้วย pFId
        /// </remarks>
        [HttpPost("Detail")]
        [ProducesResponseType(typeof(BaseResponse<object>), 200)]
        public async Task<IActionResult> GetDetail([FromBody] DetailRequest request)
        {
            // TODO: เรียก Stored Procedure spGetOutageReportDetail
            return Ok(new
            {
                success = true,
                code = "200",
                message = "Success",
                result = new object { } // คืนค่าเป็น Object รายละเอียด พร้อม FileList และ ReportStatusList
            });
        }

        /// <summary>
        /// 7. ดาวน์โหลด/ดูไฟล์แนบจาก S3 (Get File)
        /// </summary>
        /// <remarks>
        /// ดึง File จาก S3 Object Storage มาส่งออกเป็น File Stream หรือ Base64
        /// </remarks>
        /// <param name="key">Path ของไฟล์ใน S3 (s3key)</param>
        [HttpGet("file")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetFile([FromQuery] string key)
        {
            // TODO: ดึงไฟล์จาก S3 Object Storage ด้วย s3key
            // return File(fileStream, "image/png"); หรือส่งคืนเป็น Base64 ตามความเหมาะสม
            return Ok();
        }
    }
}