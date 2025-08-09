export type ContactFormData = {
  name: string
  email: string
  message: string
}

export type FormspreeResponse = {
  ok: boolean
  status: number
  body?: unknown
  error?: string
}

function getFormspreeFormId(): string | undefined {
  // Supports both Astro's PUBLIC_ convention and Vercel integration example
  // @ts-ignore - allow access; Astro exposes PUBLIC_* to client
  const astroPublic = (import.meta as any).env?.PUBLIC_FORMSPREE_FORM_ID as string | undefined
  // @ts-ignore - allow access if provided
  const vercelNextPublic = (import.meta as any).env?.NEXT_PUBLIC_FORM as string | undefined
  return astroPublic || vercelNextPublic
}

export async function submitToFormspree(data: ContactFormData): Promise<FormspreeResponse> {
  const formId = getFormspreeFormId()
  if (!formId) {
    return {
      ok: false,
      status: 500,
      error:
        'Missing Formspree form id. Set PUBLIC_FORMSPREE_FORM_ID (recommended) or NEXT_PUBLIC_FORM in your environment.'
    }
  }

  try {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('message', data.message)

    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    })

    const body = await res.json().catch(() => undefined)

    if (!res.ok) {
      let errorMsg = 'Submission failed'
      // @ts-ignore
      const errors = body?.errors as Array<{ message?: string }> | undefined
      if (errors && errors.length) {
        errorMsg = errors.map(e => e.message).filter(Boolean).join('\n') || errorMsg
      }
      return { ok: false, status: res.status, body, error: errorMsg }
    }

    return { ok: true, status: res.status, body }
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : 'Network error' }
  }
}
