'use server'

interface AccessRequestData {
  name: string
  email: string
  message: string
}

export async function sendAccessRequest(data: AccessRequestData) {
  try {
    // Aqui você pode integrar com um serviço de email real
    // Por exemplo: SendGrid, Resend, Nodemailer, etc.

    console.log("Nova solicitação de acesso:", data)

    // Simular envio de email para o administrador
    const emailContent = `
      Nova solicitação de acesso ao sistema Atitude Papelaria:
      
      Nome: ${data.name}
      Email: ${data.email}
      Motivo: ${data.message}
      
      Data: ${new Date().toLocaleString("pt-BR")}
    `

    // Aqui você enviaria o email real
    // await sendEmail({
    //   to: 'admin@atitudepapelaria.com',
    //   subject: 'Nova Solicitação de Acesso',
    //   text: emailContent
    // })

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}
