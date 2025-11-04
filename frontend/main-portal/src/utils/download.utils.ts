import { toast } from "react-toastify";

const handleDownloadFilePdf = (url: string, reportId: string) => {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${reportId}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  } catch (_) {
    toast.error('Failed to download report');
  }
};

export default handleDownloadFilePdf;
