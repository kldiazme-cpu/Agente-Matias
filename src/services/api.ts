import { ChatSession, ConversionEvent, FunnelStats, LeadFormData, Message } from '../types';

export async function fetchSessions(): Promise<ChatSession[]> {
  try {
    const res = await fetch('/api/sessions');
    if (!res.ok) throw new Error('Error al cargar sesiones');
    const data = await res.json();
    return data.sessions || [];
  } catch (err) {
    console.error('fetchSessions error:', err);
    return [];
  }
}

export async function createSession(
  title?: string,
  carreraInteres?: string,
  userProfile?: any
): Promise<ChatSession | null> {
  try {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, carreraInteres, userProfile })
    });
    if (!res.ok) throw new Error('Error al crear sesión');
    const data = await res.json();
    return data.session;
  } catch (err) {
    console.error('createSession error:', err);
    return null;
  }
}

export async function fetchSession(id: string): Promise<ChatSession | null> {
  try {
    const res = await fetch(`/api/sessions/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Sesión no encontrada');
    const data = await res.json();
    return data.session;
  } catch (err) {
    console.error('fetchSession error:', err);
    return null;
  }
}

export async function updateSession(
  id: string,
  update: { title?: string; status?: string; userProfile?: any; carreraInteres?: string }
): Promise<ChatSession | null> {
  try {
    const res = await fetch(`/api/sessions/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (!res.ok) throw new Error('Error al actualizar sesión');
    const data = await res.json();
    return data.session;
  } catch (err) {
    console.error('updateSession error:', err);
    return null;
  }
}

export async function deleteSession(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/sessions/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('deleteSession error:', err);
    return false;
  }
}

export async function trackConversion(
  sessionId: string,
  type: string,
  label: string,
  career?: string,
  metadata?: Record<string, any>
): Promise<ConversionEvent | null> {
  try {
    const res = await fetch('/api/conversions/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, type, label, career, metadata })
    });
    if (!res.ok) throw new Error('Error al registrar conversión');
    const data = await res.json();
    return data.conversion;
  } catch (err) {
    console.error('trackConversion error:', err);
    return null;
  }
}

export async function fetchFunnelStats(): Promise<FunnelStats | null> {
  try {
    const res = await fetch('/api/conversions/stats');
    if (!res.ok) throw new Error('Error al cargar métricas');
    return await res.json();
  } catch (err) {
    console.error('fetchFunnelStats error:', err);
    return null;
  }
}

export async function sendChatMessage(
  messages: Array<{ role: string; parts: Array<{ text: string }> }>,
  sessionId?: string,
  userProfile?: any,
  conversions?: any[]
) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, sessionId, userProfile, conversions })
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
}

export async function submitLead(formData: LeadFormData, sessionId?: string) {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...formData, sessionId })
  });
  if (!res.ok) {
    throw new Error('Error al registrar solicitud de admisión.');
  }
  return await res.json();
}
