import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { email, password, fullName, role } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'Campos obrigatórios: email, password, fullName, role' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName,
        role,
      },
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuário criado com sucesso', user: data });
  } catch {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: data.users });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno no servidor', err }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuário deletado com sucesso.' });
  } catch {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}