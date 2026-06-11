import { useReactFlow } from '@xyflow/react'
import { Plus, Trash2 } from 'lucide-react'
import { useCallback } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  FLOW_INPUT_TYPE_LABELS,
  FLOW_NODE_META,
  createFlowOption,
} from '@/features/flows/constants'
import type { FlowInputType, FlowNode, FlowNodeData, FlowNodeType, FlowOption } from '@/types/flow'

type FlowPropertiesPanelProps = {
  selectedNode: FlowNode | null
}

const TEXT_TYPES: FlowNodeType[] = ['message', 'question', 'options', 'list', 'input']

function textLabel(type: FlowNodeType): string {
  if (type === 'message') return 'Texto da mensagem'
  if (type === 'input') return 'Pergunta de captura'
  if (type === 'list') return 'Texto da lista'
  return 'Texto da pergunta'
}

export function FlowPropertiesPanel({ selectedNode }: FlowPropertiesPanelProps) {
  const { setNodes, deleteElements } = useReactFlow()

  const patchData = useCallback(
    (partial: Partial<FlowNodeData>) => {
      if (!selectedNode) return

      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === selectedNode.id ? { ...node, data: { ...node.data, ...partial } } : node,
        ),
      )
    },
    [selectedNode, setNodes],
  )

  const updateText = useCallback(
    (value: string) => {
      patchData({ text: value })
    },
    [patchData],
  )

  const updateOptions = useCallback(
    (updater: (options: FlowOption[]) => FlowOption[]) => {
      if (!selectedNode) return
      const current = selectedNode.data.options ?? []
      patchData({ options: updater(current) })
    },
    [patchData, selectedNode],
  )

  const handleDelete = useCallback(() => {
    if (!selectedNode || selectedNode.type === 'start') return
    void deleteElements({ nodes: [{ id: selectedNode.id }] })
  }, [deleteElements, selectedNode])

  if (!selectedNode) {
    return (
      <aside className="flex w-72 shrink-0 flex-col border-l border-surface-700/80 bg-surface-900/80 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Propriedades</h3>
        <p className="mt-4 text-sm text-slate-500">Selecione um nó para editar suas propriedades.</p>
        <p className="mt-6 text-xs leading-relaxed text-slate-600">
          Arraste das saídas para conectar blocos. Use Delete ou o botão Excluir para remover.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          Em qualquer texto, use <code className="text-accent-400">{'{{variavel}}'}</code> para
          inserir respostas capturadas.
        </p>
      </aside>
    )
  }

  const type = selectedNode.type as FlowNodeType
  const meta = FLOW_NODE_META[type]
  const hasText = TEXT_TYPES.includes(type)
  const canDelete = type !== 'start'
  const supportsRetry =
    type === 'question' || type === 'options' || type === 'list' || type === 'input'
  const hasOptions = type === 'options' || type === 'list'
  const options = selectedNode.data.options ?? []

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-l border-surface-700/80 bg-surface-900/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Propriedades</h3>
      <p className="mt-1 mb-4 text-sm font-medium text-white">{meta.label}</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="node-label">Nome de identificação</Label>
          <Input
            id="node-label"
            value={selectedNode.data.label}
            placeholder={meta.label}
            onChange={(e) => patchData({ label: e.target.value })}
          />
          <p className="text-xs text-slate-500">
            Aparece no bloco apenas para identificação; não é enviado ao usuário.
          </p>
        </div>

        {hasText && (
          <div className="space-y-2">
            <Label htmlFor="node-text">{textLabel(type)}</Label>
            <Textarea
              id="node-text"
              value={selectedNode.data.text ?? ''}
              onChange={(e) => updateText(e.target.value)}
              placeholder={
                type === 'message' ? 'Texto que o bot enviará...' : 'Pergunta para o usuário...'
              }
            />
            <p className="text-xs text-slate-500">
              Use <code className="text-accent-400">{'{{variavel}}'}</code> para inserir respostas
              já capturadas.
            </p>
            {type === 'question' && (
              <p className="text-xs text-slate-500">
                Conecte <span className="text-emerald-400">Sim</span> e{' '}
                <span className="text-red-400">Não</span> aos próximos blocos.
              </p>
            )}
          </div>
        )}

        {hasOptions && (
          <div className="space-y-2">
            <Label>Opções</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="rounded-lg border border-surface-700/70 p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{index + 1}.</span>
                    <Input
                      className="h-9"
                      value={option.label}
                      placeholder="Rótulo da opção"
                      onChange={(e) =>
                        updateOptions((opts) =>
                          opts.map((opt) =>
                            opt.id === option.id ? { ...opt, label: e.target.value } : opt,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      aria-label="Remover opção"
                      className="shrink-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      onClick={() =>
                        updateOptions((opts) => opts.filter((opt) => opt.id !== option.id))
                      }
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <Input
                    className="mt-2 h-8 text-xs"
                    value={option.value ?? ''}
                    placeholder="Valor salvo (opcional)"
                    onChange={(e) =>
                      updateOptions((opts) =>
                        opts.map((opt) =>
                          opt.id === option.id
                            ? { ...opt, value: e.target.value || undefined }
                            : opt,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => updateOptions((opts) => [...opts, createFlowOption(`Opção ${opts.length + 1}`)])}
            >
              <Plus className="size-4" />
              Adicionar opção
            </Button>
            <p className="text-xs text-slate-500">
              {type === 'list'
                ? 'O usuário escolhe pelo número ou pelo texto; o fluxo segue por uma única saída.'
                : 'Cada opção tem uma saída própria. O usuário pode responder pelo número ou pelo texto.'}
            </p>
          </div>
        )}

        {type === 'list' && (
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="size-4 rounded border-surface-600 bg-surface-900 accent-accent-500"
              checked={selectedNode.data.multiple !== false}
              onChange={(e) => patchData({ multiple: e.target.checked })}
            />
            Permitir escolher várias opções
          </label>
        )}

        {(type === 'options' || type === 'list' || type === 'input') && (
          <div className="space-y-2">
            <Label htmlFor="node-variable">Salvar resposta em (variável)</Label>
            <Input
              id="node-variable"
              value={selectedNode.data.variable ?? ''}
              placeholder="ex: nome, email"
              onChange={(e) => patchData({ variable: e.target.value.trim() || undefined })}
            />
            <p className="text-xs text-slate-500">
              Reutilize depois com{' '}
              <code className="text-accent-400">
                {`{{${selectedNode.data.variable?.trim() || 'variavel'}}}`}
              </code>
              .
            </p>
          </div>
        )}

        {type === 'input' && (
          <div className="space-y-2">
            <Label htmlFor="node-input-type">Tipo de validação</Label>
            <Select
              id="node-input-type"
              value={selectedNode.data.inputType ?? 'text'}
              onChange={(e) => patchData({ inputType: e.target.value as FlowInputType })}
            >
              {Object.entries(FLOW_INPUT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        )}

        {hasOptions && (
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="size-4 rounded border-surface-600 bg-surface-900 accent-accent-500"
              checked={selectedNode.data.listOptions !== false}
              onChange={(e) => patchData({ listOptions: e.target.checked })}
            />
            Listar as opções na mensagem
          </label>
        )}

        {supportsRetry && (
          <>
            <div className="space-y-2">
              <Label htmlFor="node-max-attempts">Tentativas extras antes do fallback</Label>
              <Input
                id="node-max-attempts"
                type="number"
                min={0}
                max={5}
                value={selectedNode.data.maxAttempts ?? 0}
                onChange={(e) =>
                  patchData({ maxAttempts: Math.max(0, Number(e.target.value) || 0) })
                }
              />
              <p className="text-xs text-slate-500">
                Quantas vezes o bot repete a pergunta antes de seguir pela saída de Fallback (ou
                padrão).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-invalid">Mensagem de resposta inválida</Label>
              <Textarea
                id="node-invalid"
                value={selectedNode.data.invalidMessage ?? ''}
                placeholder="Ex: Não entendi, pode tentar de novo?"
                onChange={(e) => patchData({ invalidMessage: e.target.value || undefined })}
              />
            </div>
          </>
        )}

        <p className="text-xs text-slate-500">ID: {selectedNode.id}</p>

        {canDelete && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full border-red-500/30 text-red-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-200"
            onClick={handleDelete}
          >
            <Trash2 className="size-4" />
            Excluir bloco
          </Button>
        )}

        {type === 'start' && (
          <p className="text-xs text-slate-500">O bloco Início é obrigatório e não pode ser removido.</p>
        )}
      </div>
    </aside>
  )
}
