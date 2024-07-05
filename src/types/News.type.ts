export type NewsType = {
  _id: string;
  title: string;
  type: 'news' | 'promotion';
  shortDescription: string;
  fullDescription: string;
  image: string;
  __v: 0
};

export type CreateNewsPayload = {
  title: string;
  type: string;
  shortDescription: string;
  fullDescription: string;
  image: File | null;
};