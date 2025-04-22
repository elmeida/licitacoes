
import { useState, Fragment } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Processo {
  id: string;
  memorando: string;
  responsavel: string;
  objeto: string;
  modalidade: string;
  valorReferencia: number;
  dataInicio: string;
  dataFim: string;
  status: string;
  observacoes: string;
}

interface Tramite {
  processoId: string;
  etapa: string;
  data: string;
  responsavel: string;
  observacao: string;
}

const gerarId = (() => {
  let contador = 1;
  return () => `DTIC-${contador++}`;
})();

const processosExemplo: Processo[] = [
  {
    id: "DTIC-1",
    memorando: "Memo001",
    responsavel: "Lívia",
    objeto: "Serviço Contínuo",
    modalidade: "Pregão",
    valorReferencia: 524050.5,
    dataInicio: "29/01/2025",
    dataFim: "30/01/2025",
    status: "Não Iniciado",
    observacoes: "CLC"
  },
  {
    id: "DTIC-2",
    memorando: "Memo002",
    responsavel: "Rodolfo",
    objeto: "Banco de Preços",
    modalidade: "Inexigibilidade",
    valorReferencia: 516600,
    dataInicio: "02/02/2025",
    dataFim: "04/02/2025",
    status: "Em Andamento",
    observacoes: "PGM"
  }
];

const tramitesMock: Tramite[] = [
  {
    processoId: "DTIC-1",
    etapa: "Recebido da DTIC",
    data: "2025-01-25",
    responsavel: "Lívia",
    observacao: "Protocolo iniciado",
  },
];

export default function Home() {
  const [processos, setProcessos] = useState<Processo[]>(processosExemplo);
  const [tramites, setTramites] = useState<Tramite[]>(tramitesMock);
  const [formProcesso, setFormProcesso] = useState<Omit<Processo, "id">>({
    memorando: "",
    responsavel: "",
    objeto: "",
    modalidade: "",
    valorReferencia: 0,
    dataInicio: "",
    dataFim: "",
    status: "Não Iniciado",
    observacoes: ""
  });
  const [formTramite, setFormTramite] = useState<Omit<Tramite, "data">>({
    processoId: "",
    etapa: "Recebido da DTIC",
    responsavel: "",
    observacao: ""
  });

  const [isNovoOpen, setIsNovoOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const adicionarProcesso = () => {
    const novo: Processo = {
      ...formProcesso,
      id: gerarId(),
      dataInicio: format(new Date(formProcesso.dataInicio), "dd/MM/yyyy", { locale: ptBR }),
      dataFim: format(new Date(formProcesso.dataFim), "dd/MM/yyyy", { locale: ptBR })
    };
    setProcessos([...processos, novo]);
    setIsNovoOpen(false);
  };

  const adicionarTramite = () => {
    setTramites([
      ...tramites,
      {
        ...formTramite,
        data: new Date().toISOString()
      }
    ]);
    setFormTramite({ ...formTramite, observacao: "" });
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#004b8d]">Painel de Processos</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <Input placeholder="Buscar por ID ou objeto" value={""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}} />
        <select className="p-2 border rounded" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {}}>
          <option>Todos os Status</option>
        </select>
        <select className="p-2 border rounded" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {}}>
          <option>Todas as Modalidades</option>
        </select>
        <Button onClick={() => setIsNovoOpen(true)}>+ Novo Processo</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {processos.map(proc => (
          <Card key={proc.id}>
            <CardContent className="p-4 space-y-1">
              <div className="text-lg font-semibold">{proc.objeto}</div>
              <div><strong>ID:</strong> {proc.id}</div>
              <div><strong>Memorando:</strong> {proc.memorando}</div>
              <div><strong>Responsável:</strong> {proc.responsavel}</div>
              <div><strong>Modalidade:</strong> {proc.modalidade}</div>
              <div><strong>Valor:</strong> R$ {proc.valorReferencia.toFixed(2)}</div>
              <div><strong>Início:</strong> {proc.dataInicio}</div>
              <div><strong>Fim:</strong> {proc.dataFim}</div>
              <div><strong>Observações:</strong> {proc.observacoes}</div>
              <Button onClick={() => {
                setSelecionado(proc.id);
                setFormTramite({ ...formTramite, processoId: proc.id });
                setIsOpen(true);
              }}>Histórico / Tramitar</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isNovoOpen} onClose={() => setIsNovoOpen(false)} as={Fragment}>
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded p-6 w-full max-w-lg space-y-4">
            <Dialog.Title className="text-lg font-bold">Novo Processo</Dialog.Title>
            <Input placeholder="Memorando" value={formProcesso.memorando} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormProcesso({ ...formProcesso, memorando: e.target.value })} />
            <Input placeholder="Responsável" value={formProcesso.responsavel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormProcesso({ ...formProcesso, responsavel: e.target.value })} />
            <Input placeholder="Objeto" value={formProcesso.objeto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormProcesso({ ...formProcesso, objeto: e.target.value })} />
            <Input placeholder="Modalidade" value={formProcesso.modalidade} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormProcesso({ ...formProcesso, modalidade: e.target.value })} />
            <Input placeholder="Valor de Referência" type="number" value={formProcesso.valorReferencia} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormProcesso({ ...formProcesso, valorReferencia: +e.target.value })} />
            <Input placeholder="Data Início" type="date" value={formProcesso.dataInicio} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormProcesso({ ...formProcesso, dataInicio: e.target.value })} />
            <Input placeholder="Data Fim" type="date" value={formProcesso.dataFim} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormProcesso({ ...formProcesso, dataFim: e.target.value })} />
            <Textarea placeholder="Observações" value={formProcesso.observacoes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormProcesso({ ...formProcesso, observacoes: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsNovoOpen(false)} className="bg-gray-200 text-black">Cancelar</Button>
              <Button onClick={adicionarProcesso}>Salvar</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      
<Dialog open={isOpen} onClose={() => setIsOpen(false)} as={Fragment}>
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
    <Dialog.Panel className="bg-white rounded p-6 w-full max-w-lg space-y-4">
      <Dialog.Title className="text-lg font-bold">Histórico / Tramitação</Dialog.Title>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {tramites
          .filter(t => t.processoId === selecionado)
          .map((t, i) => (
            <div key={i} className="border-l-4 border-verdePrefeitura pl-3">
              <div className="font-medium text-sm">{t.etapa}</div>
              <div className="text-xs text-gray-500 mb-1">{format(new Date(t.data), "dd/MM/yyyy", { locale: ptBR })}</div>
              <div className="text-sm font-semibold">{t.responsavel}</div>
              <div className="text-xs text-gray-700">{t.observacao}</div>
            </div>
          ))}
      </div>

      <select
        className="p-2 border rounded w-full"
        value={formTramite.etapa}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setFormTramite({ ...formTramite, etapa: e.target.value })
        }
      >
        <option>Recebido da DTIC</option>
        <option>Encaminhado para CLC</option>
        <option>Retornado para apontamentos</option>
        <option>Enviado para CGM</option>
        <option>Enviado para PGM</option>
      </select>

      <Input
        placeholder="Responsável"
        value={formTramite.responsavel}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormTramite({ ...formTramite, responsavel: e.target.value })
        }
      />

      <Textarea
        placeholder="Observação"
        value={formTramite.observacao}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormTramite({ ...formTramite, observacao: e.target.value })
        }
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={() => setIsOpen(false)}
          className="bg-gray-200 text-black hover:bg-gray-300"
        >
          Fechar
        </Button>
        <Button className="bg-verdePrefeitura hover:bg-green-800" onClick={adicionarTramite}>
          Salvar Etapa
        </Button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

    </div>
  );
}
