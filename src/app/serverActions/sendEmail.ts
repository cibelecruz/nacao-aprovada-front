'use server'

import nodemailer from 'nodemailer'

interface SendEmailProps {
  payloader: {
    coachEmail: string
    studentsEmail: string[]
    title: string
    description: string
    files: File[]
  }
}

export default async function SendEmail({ payloader }: SendEmailProps) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  })

  const error = []
  const attachments = payloader.files
    ? await Promise.all(
        payloader.files.map(async (file) => ({
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
        })),
      )
    : []

  for (let i = 0; payloader.studentsEmail.length > i; i++) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: payloader.studentsEmail[i],
        subject: payloader.title,
        text: `Email de ${payloader.coachEmail}.\n\n${payloader.description}`,
        attachments,
      })
    } catch {
      error.push(payloader.studentsEmail[i])
    }
  }
  return error
}
