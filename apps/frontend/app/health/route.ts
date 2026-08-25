// Replaces the /health location in the retired apps/frontend/nginx.conf,
// in case anything (an uptime monitor, the Oracle Cloud host nginx) still
// depends on that path existing.
export const dynamic = 'force-dynamic'

export function GET() {
  return new Response('healthy\n', { headers: { 'Content-Type': 'text/plain' } })
}
