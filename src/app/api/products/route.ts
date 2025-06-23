import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { name, barcode, price, quantity, supplier } = body

  if (!name || !barcode || price == null || quantity == null || !supplier) {
    return NextResponse.json({ error: 'Campos inválidos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert({ name, barcode, price, quantity, supplier })
    .select()


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data[0] }, { status: 201 })
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { id, name, barcode, price, quantity, supplier } = body

  if (!id || !name || !barcode || price == null || quantity == null || !supplier) {
    return NextResponse.json({ error: 'Campos inválidos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .update({ name, barcode, price, quantity, supplier })
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data.length) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ product: data[0] })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
  }

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Produto deletado com sucesso' })
}
