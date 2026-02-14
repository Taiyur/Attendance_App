export type EmployeeEmbedding = {
  employeeId: string;
  embeddings: number[][];
};

export const localDB: {
  employees: EmployeeEmbedding[];
} = {
  employees: []
};
