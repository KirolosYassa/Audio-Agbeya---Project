import { Alert } from 'react-native';
import { AudioHostNotConfigured } from '../../services/audioDownload';

export const downloadFailureMessage = (error: unknown): string =>
  error instanceof AudioHostNotConfigured ? 'رابط الصوت غير مضبوط في التطبيق بعد.' : 'تأكد من الاتصال بالإنترنت وحاول مرة أخرى.';

export const alertDownloadFailure = (error: unknown): void => Alert.alert('تعذّر تحميل الصوت', downloadFailureMessage(error));
