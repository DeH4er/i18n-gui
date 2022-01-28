import { Button, KIND } from 'baseui/button';
import { Paragraph1 } from 'baseui/typography';
import React, { useMemo, useState } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import Tooltip from 'src/components/Tooltip';
import { countLeafs } from 'src/core/tree';
import TranslationHeader from './TranslationHeader';
import TranslationRemoveModal from './TranslationRemoveModal';

export default function TranslationGroup({
  translation,
  select,
  remove,
  rename,
}) {
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const count = useMemo(() => countLeafs(translation), [translation]);

  function confirmRemove() {
    setRemoveModalOpen(false);
    remove(translation);
  }

  return (
    <div>
      <TranslationHeader path={translation.path} select={select}>
        <Tooltip tooltip="Delete">
          <Button
            data-testid="remove-node"
            kind={KIND.secondary}
            onClick={() => setRemoveModalOpen(true)}
          >
            <FiTrash />
          </Button>
        </Tooltip>

        <Tooltip tooltip="Rename">
          <Button
            data-testid="rename-node"
            kind={KIND.secondary}
            onClick={rename}
          >
            <FiEdit />
          </Button>
        </Tooltip>
      </TranslationHeader>

      <section style={{ padding: '20px' }}>
        <Paragraph1>Has {count} translations.</Paragraph1>
      </section>

      <TranslationRemoveModal
        translation={translation}
        count={count}
        onCancel={() => setRemoveModalOpen(false)}
        onConfirm={confirmRemove}
        isOpen={removeModalOpen}
      />
    </div>
  );
}
