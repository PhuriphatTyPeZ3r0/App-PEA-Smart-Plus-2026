using System.Collections.Generic;

namespace PEASmartPlus3.Models
{
    // Common Response
    public class BaseResponse<T>
    {
        public bool Success { get; set; }
        public string Code { get; set; }
        public string Message { get; set; }
        public T Result { get; set; }
    }

    // 1. OutageType
    public class OutageTypeRequest { public string? Lang { get; set; } }
    public class OutageTypeResponse
    {
        public int PFTId { get; set; }
        public string OutageTypeName { get; set; }
        public string TroubleCode { get; set; }
    }

    // 2. Upload
    public class UploadRequest
    {
        public int FileNo { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string FileData { get; set; } // Base64
    }
    public class UploadResponse
    {
        public int FileNo { get; set; }
        public string FileId { get; set; }
        public string FileName { get; set; }
        public string S3Key { get; set; }
        public string FileType { get; set; }
    }

    // 3. DeleteFile
    public class DeleteFileRequest { public string S3Key { get; set; } }

    // 4. SendReport
    public class SendReportRequest
    {
        public int PFTId { get; set; }
        public bool IsManualLocation { get; set; }
        public int? UserMeterId { get; set; }
        public string Ca { get; set; }
        public string PeaNo { get; set; }
        public string ContactName { get; set; }
        public string ContactSurName { get; set; }
        public string ContactPhoneNo { get; set; }
        public string Memo { get; set; }
        public List<FileAttachment> FileAttachmentList { get; set; }
        public string Lang { get; set; }
    }
    public class FileAttachment
    {
        public int FileNo { get; set; }
        public string FileId { get; set; } // หรือ Uuid ตามเอกสาร
        public string FileName { get; set; }
        public string S3Key { get; set; }
        public string FileType { get; set; }
    }
    public class SendReportResponse { public long PFId { get; set; } }

    // 5. History
    public class HistoryRequest
    {
        public long? PFIdIndex { get; set; }
        public string Lang { get; set; }
    }
    public class HistoryResponse
    {
        public long PFId { get; set; }
        public string Ca { get; set; }
        public string CreateDate { get; set; }
        public long UserAccId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }

    // 6. Detail
    public class DetailRequest
    {
        public long PFId { get; set; }
        public string Lang { get; set; }
    }
    // (หมายเหตุ: DetailResponse มีฟิลด์ค่อนข้างเยอะตามเอกสาร สามารถสร้าง Class มารองรับ Result, FileList, ReportStatusList ได้ตามโครงสร้าง JSON)
}