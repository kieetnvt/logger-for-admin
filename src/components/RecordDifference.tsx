import {
  FormGroup,
  Label,
  Table as AdminTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@adminjs/design-system';
import { BasePropertyProps, flat } from 'adminjs';
import React, { FC } from 'react';
import { styled } from '@adminjs/design-system/styled-components';

const Cell = styled(TableCell)`
  width: 100%;
  word-break: break-word;
`;
const Row = styled(TableRow)`
  display: flex;
  position: unset;
`;
const Head = styled(TableHead)`
  display: flex;
  position: unset;
`;
const Table = styled(AdminTable)`
  width: 100%;
  position: unset;
  display: block;
`;

const RecordDifference: FC<BasePropertyProps> = ({ record, property }) => {
  const differences = JSON.parse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (flat.unflatten(record?.params ?? {}) as any)?.[property.name] ?? {}
  );

  if (!differences) {
    return null;
  }

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <Table>
        <Head>
          <Row>
            <Cell>Property name</Cell>
            <Cell>Before</Cell>
            <Cell>After</Cell>
          </Row>
        </Head>
        <TableBody>
          {Object.entries(
            differences as Record<string, { before: string; after: string }>
          ).map(([propertyName, { before, after }]) => {
            return (
              <Row key={propertyName}>
                <Cell width={1 / 3}>{propertyName}</Cell>
                <Cell color="red" width={1 / 3}>
                  {JSON.stringify(before) || 'undefined'}
                </Cell>
                <Cell color="green" width={1 / 3}>
                  {JSON.stringify(after) || 'undefined'}
                </Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </FormGroup>
  );
};

export default RecordDifference;
