import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "./ui/input";
import { Product } from "./stock";
import { useEffect, useState } from "react";

interface ButtonEditProductProps {
  product: Product;
  listProduct: Product[];
  setListProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'Adicionar' | 'Remover'
}

export default function ButtonEditQuantity({ open, product, setOpen, listProduct, setListProduct, type }: ButtonEditProductProps) {
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);

  useEffect(() => {
    setAdjustQuantity(0);
  }, [product, open]);

  async function handleQuantityChange() {
    let updatedQuantity = product.quantity;

    if (type === 'Adicionar') {
      updatedQuantity = product.quantity + adjustQuantity;
    } else if (type === 'Remover') {
      updatedQuantity = product.quantity - adjustQuantity;
      if (updatedQuantity < 0) updatedQuantity = 0;
    }

    const updatedProduct = { ...product, quantity: updatedQuantity };

    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });

    if (res.ok) {
      const data = await res.json();
      const updated = data.product;

      setListProduct(
        listProduct.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      setOpen(false);
      setAdjustQuantity(0);
    } else {
      const errorData = await res.json();
      console.error('Erro ao atualizar quantidade:', errorData.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black rounded-lg border border-gray-600 p-6 w-full max-w-md mx-4 text-white">
        <DialogHeader>
          <DialogTitle className='text-lg'>
            {type === 'Adicionar' ? 'Adicionar Quantia' : 'Remover Quantia'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <p>Produto: <strong>{product.name}</strong></p>
          <p>Quantidade atual: <strong>{product.quantity}</strong></p>

          <label className="block text-white font-medium mb-2">
            {type === 'Adicionar' ? 'Quantidade a adicionar' : 'Quantidade a remover'}
          </label>
          <Input
            type="number"
            min={0}
            value={adjustQuantity}
            onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
            className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
          />
        </div>

        <div className='flex flex-row justify-end gap-4 mt-8'>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleQuantityChange}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            Salvar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
