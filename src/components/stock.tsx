'use client'

import { ArrowDown, ArrowUp, Package, Plus, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ButtonEditProduct from './buttonEditProductModal'
import ButtonEditQuantity from './buttonEditQuantityModal'
import { useAuth } from '@/context/AuthContext'

export interface Product {
  id: string
  name: string
  barcode: string
  price: number
  quantity: number
  supplier: string
}

function formatPrice(value: string) {
  let numeric = value.replace(/\D/g, '')
  numeric = numeric.padStart(3, '0')
  const cents = numeric.slice(-2)
  const reais = numeric.slice(0, -2)
  return `R$ ${parseInt(reais, 10).toLocaleString('pt-BR')},${cents}`
}

function formatBarcode(value: string) {
  return value.replace(/\D/g, '').slice(0, 13)
}

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(false)
  const [editQuantity, setEditQuantity] = useState(false)
  const [typeQuantity, setTypeQuantity] = useState<'Adicionar' | 'Remover'>('Adicionar')
  const { user } = useAuth()

  const [productEdit, setProductEdit] = useState<Product>({
    id: '',
    name: '',
    barcode: '',
    price: 0,
    quantity: 0,
    supplier: '',
  })

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    barcode: '',
    price: 0,
    quantity: 0,
    supplier: '',
  })

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase()
    return (
      product.name.toLowerCase().includes(term) ||
      String(product.barcode).toLowerCase().includes(term) ||
      product.supplier.toLowerCase().includes(term)
    )
  })

  const handleAddProduct = async () => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })

    if (res.status === 201) {
      const data = await res.json()
      const createdProduct = data.product

      setProducts((prev) => [...prev, createdProduct])

      setNewProduct({ name: '', barcode: '', price: 0, quantity: 0, supplier: '' })
      console.log('Sucesso! informações salvas no banco de dados.')
      setOpenModal(false)
      return
    }

    console.log('Erro! Não foi possível salvar as informações no banco.')
  }

  useEffect(() => {
    async function loadInformations() {
      const res = await fetch('/api/products', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      setProducts(data.products)
    }

    loadInformations()
  }, [])

  return (
    <div className="bg-black min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Estoque</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-96 bg-neutral-800 border-white text-white placeholder:text-gray-400 focus:border-gray-500"
              />
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
              {user?.user_metadata.role === 'admin' && (
                <DialogTrigger asChild>
                  <Button className="cursor-pointer bg-white text-black hover:bg-gray-100 font-medium px-6">
                    <Package className="w-5 h-5 mr-2" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
              )}

              <DialogContent className="bg-black rounded-lg border border-gray-600 p-6 w-full max-w-md mx-4 text-white">

                <DialogHeader>
                  <div className="flex items-center justify-between mb-6">
                    <DialogTitle className="text-lg">Adicionar Novo Produto</DialogTitle>
                  </div>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Nome do produto</label>
                    <Input
                      placeholder="Nome do produto"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Código de barras</label>
                    <Input
                      placeholder="Código de barras"
                      value={newProduct.barcode}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, barcode: formatBarcode(e.target.value) })
                      }
                      className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Fornecedor</label>
                    <Input
                      placeholder="Fornecedor"
                      value={newProduct.supplier}
                      onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                      className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Preço</label>
                    <Input
                      placeholder="R$ 0,00"
                      value={
                        newProduct.price > 0
                          ? formatPrice(String(newProduct.price.toFixed(2).replace('.', '')))
                          : ''
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '')
                        const priceNumber = parseFloat((parseInt(raw || '0') / 100).toFixed(2))
                        setNewProduct({ ...newProduct, price: priceNumber })
                      }}
                      className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Quantidade inicial</label>
                    <Input
                      placeholder="Quantidade"
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
                    />
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      onClick={handleAddProduct}
                      className="cursor-pointer flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Adicionar Produto
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-lg border border-white bg-neutral-800">
          <Table>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-neutral-400 py-8">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className={`cursor-pointer border-neutral-700 hover:bg-neutral-800 ${index % 2 === 0 ? 'bg-black' : 'bg-neutral-900'
                      }`}
                    onClick={() => [setProductEdit(product), setEditingProduct(true)]}
                  >
                    <TableCell className="text-white text-center">{product.name}</TableCell>
                    <TableCell className="text-white text-center">{product.barcode}</TableCell>
                    <TableCell className="text-white text-center">{product.supplier}</TableCell>
                    <TableCell className="text-white text-center">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="text-white text-center">{product.quantity}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          className='cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation()
                            setTypeQuantity('Remover')
                            setProductEdit(product)
                            setEditQuantity(true)
                            setEditingProduct(false)
                          }}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="cursor-pointer bg-green-500 hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            setTypeQuantity('Adicionar')
                            setProductEdit(product)
                            setEditQuantity(true)
                            setEditingProduct(false)
                          }}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <ButtonEditProduct
            open={editingProduct}
            setOpen={setEditingProduct}
            product={productEdit}
            listProduct={products}
            setListProduct={setProducts}
          />
          <ButtonEditQuantity
            open={editQuantity}
            setOpen={setEditQuantity}
            product={productEdit}
            listProduct={products}
            setListProduct={setProducts}
            type={typeQuantity}
          />
        </div>
      </div>
    </div>
  )
}
