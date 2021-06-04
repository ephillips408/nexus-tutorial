import { scalarType } from "nexus";

const uuidType = scalarType({
  name: 'UUID',
  serialize: value => value
})