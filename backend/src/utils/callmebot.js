import fetch from 'node-fetch';
 
const apiKey = process.env.CALLMEBOT_API_KEY;

export async function enviarMensajeWhatsApp(numero, mensaje) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${numero}&text=${encodeURIComponent(mensaje)}&apikey=${apiKey}`;
  console.log('URL para CallMeBot:', url);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log('Respuesta CallMeBot:', text);
    return text;
  } catch (error) {
    console.error('Error enviando mensaje a WhatsApp:', error);
    throw error;
  }
}