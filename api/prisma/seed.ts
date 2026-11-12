import "dotenv/config";
import { PrismaClient } from '../src/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up existing data
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  // 1. Create Genres (at least 4)
  const fiction = await prisma.genre.create({ data: { name: 'Fiction', description: 'Imaginative storytelling and novels' } });
  const scifi = await prisma.genre.create({ data: { name: 'Sci-Fi', description: 'Science fiction and futuristic concepts' } });
  const fantasy = await prisma.genre.create({ data: { name: 'Fantasy', description: 'Magic and mythical worlds' } });
  const history = await prisma.genre.create({ data: { name: 'History', description: 'Historical accounts and non-fiction' } });

  // 2. Create Books (at least 15 distributed across genres)
  const booksData = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', publishedYear: 1925, genreId: fiction.id },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', publishedYear: 1960, genreId: fiction.id },
    { title: '1984', author: 'George Orwell', isbn: '9780451524935', publishedYear: 1949, genreId: fiction.id },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', publishedYear: 1813, genreId: fiction.id },
    { title: 'Dune', author: 'Frank Herbert', isbn: '9780441172719', publishedYear: 1965, genreId: scifi.id },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', publishedYear: 1984, genreId: scifi.id },
    { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', publishedYear: 1951, genreId: scifi.id },
    { title: 'Snow Crash', author: 'Neal Stephenson', isbn: '9780553380958', publishedYear: 1992, genreId: scifi.id },
    { title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', isbn: '9780618346257', publishedYear: 1954, genreId: fantasy.id },
    { title: 'Harry Potter and the Sorcerers Stone', author: 'J.K. Rowling', isbn: '9780590353427', publishedYear: 1997, genreId: fantasy.id },
    { title: 'The Way of Kings', author: 'Brandon Sanderson', isbn: '9780765326357', publishedYear: 2010, genreId: fantasy.id },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '9780756404749', publishedYear: 2007, genreId: fantasy.id },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '9780062316098', publishedYear: 2014, genreId: history.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317558', publishedYear: 1997, genreId: history.id },
    { title: 'A Peoples History of the United States', author: 'Howard Zinn', isbn: '9780060838652', publishedYear: 1980, genreId: history.id },
  ];

  for (const book of booksData) {
    await prisma.book.create({ data: book });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });