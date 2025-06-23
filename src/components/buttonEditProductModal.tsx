import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "./ui/input";
import { Product } from "./stock";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ButtonEditProductProps {
  product: Product;
  listProduct: Product[];
  setListProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function formatPrice(value: string) {
  let numeric = value.replace(/\D/g, '');
  numeric = numeric.padStart(3, '0');
  const cents = numeric.slice(-2);
  const reais = numeric.slice(0, -2);
  return `R$ ${parseInt(reais, 10).toLocaleString('pt-BR')},${cents}`;
}

function formatBarcode(value: string) {
  return value.replace(/\D/g, '').slice(0, 13);
}

export default function ButtonEditProduct({ open, product, setOpen, listProduct, setListProduct }: ButtonEditProductProps) {
  const [newProduct, setNewProduct] = useState<Product>(product);
  const { user } = useAuth();

  useEffect(() => {
    setNewProduct(product);
  }, [product]);

  async function handleDelete() {
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id })
    });

    if (res.ok) {
      console.log('Sucesso! item excluído.');
      setListProduct(listProduct.filter((item) => item.id !== product.id));
      setOpen(false);
    } else {
      const errorData = await res.json();
      console.error('Erro ao excluir:', errorData.error);
    }
  }

  async function handleEdit() {
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      const data = await res.json();
      const updatedProduct = data.product;

      console.log('Produto atualizado com sucesso:', updatedProduct);

      setListProduct(
        listProduct.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item
        )
      );

      setOpen(false);
    } else {
      const errorData = await res.json();
      console.error('Erro ao editar produto:', errorData.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black rounded-lg border border-gray-600 p-6 w-full max-w-md mx-4 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className='text-lg'>
              {user?.user_metadata.role === 'admin' ? "Editar Produto" : 'Visualizar produto'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-white font-medium mb-2">Nome do produto</label>
            <Input
              disabled={user?.user_metadata.role === 'funcionario'}
              placeholder="Nome do produto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Código de barras</label>
            <Input
              disabled={user?.user_metadata.role === 'funcionario'}
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
              disabled={user?.user_metadata.role === 'funcionario'}
              placeholder="Fornecedor"
              value={newProduct.supplier}
              onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
              className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Preço</label>
            <Input
              disabled={user?.user_metadata.role === 'funcionario'}
              placeholder="R$ 0,00"
              value={
                newProduct.price > 0
                  ? formatPrice(String(newProduct.price.toFixed(2).replace('.', '')))
                  : ''
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                const priceNumber = parseFloat((parseInt(raw || '0') / 100).toFixed(2));
                setNewProduct({ ...newProduct, price: priceNumber });
              }}
              className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Quantidade inicial</label>
            <Input
              disabled={user?.user_metadata.role === 'funcionario'}
              placeholder="Quantidade"
              type="number"
              value={Number.isNaN(newProduct.quantity) ? '' : newProduct.quantity}
              onChange={(e) => {
                const val = e.target.value;
                const num = parseInt(val);
                setNewProduct({ ...newProduct, quantity: isNaN(num) ? NaN : num });
              }}
              className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
            />
          </div>
        </div>

        {user?.user_metadata.role !== 'funcionario' && (
          <div className='flex flex-row justify-between gap-4 mt-8'>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Excluir
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Salvar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
