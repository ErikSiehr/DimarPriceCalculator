import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { pdfBase64, patientName, formType, visualizationPdfBase64 } = await request.json()

    if (!process.env.RECIPIENT_EMAIL) {
      return Response.json(
        { success: false, error: 'Empfänger-E-Mail nicht konfiguriert' },
        { status: 500 }
      )
    }

    const attachments = [
      {
        filename: `${formType === 'lebensgeschichte' ? 'Lebensgeschichte' : 'Anamnese'}_${patientName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBase64,
      },
    ]

    // Add visualization PDF for Lebensgeschichte
    if (formType === 'lebensgeschichte' && visualizationPdfBase64) {
      attachments.push({
        filename: `Lebensgeschichte_Visualisierung_${patientName.replace(/\s+/g, '_')}.pdf`,
        content: visualizationPdfBase64,
      })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Anamnese Formular <formular@resend.dev>',
      to: process.env.RECIPIENT_EMAIL,
      subject: `Neue ${formType === 'lebensgeschichte' ? 'Lebensgeschichte' : 'Anamnese'}: ${patientName}`,
      html: `
        <h2>Neues Formular eingegangen</h2>
        <p><strong>Formulartyp:</strong> ${formType === 'lebensgeschichte' ? 'Lebensgeschichte' : 'Anamnese'}</p>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>Die ausgefüllten Formulare finden Sie im Anhang.</p>
      `,
      attachments,
    })

    if (error) {
      console.error('Resend error:', error)
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return Response.json({ success: true, data })
  } catch (error) {
    console.error('Email sending error:', error)
    return Response.json(
      { success: false, error: 'E-Mail konnte nicht gesendet werden' },
      { status: 500 }
    )
  }
}
