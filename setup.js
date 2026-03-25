#!/usr/bin/env node

/**
 * Library System Setup Script
 *
 * This script helps you set up your Supabase database for the Library Resource Orchestration System.
 * Run this after creating your Supabase project and running the schema.sql file.
 *
 * Usage: node setup.js
 */

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('🚀 Library Resource Orchestration System Setup\n');

  try {
    // Get Supabase credentials
    const supabaseUrl = await ask('Enter your Supabase project URL: ');
    const supabaseKey = await ask('Enter your Supabase service role key (from Project Settings > API): ');

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase URL and service role key are required');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('\n📋 Setting up sample data...\n');

    // Create sample books
    const sampleBooks = [
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        category: 'Computer Science',
        isbn: '978-0262033848',
        description: 'A comprehensive textbook on algorithms covering a broad range of algorithms in depth.',
        total_copies: 5,
        available_copies: 3,
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'Software Engineering',
        isbn: '978-0132350884',
        description: 'A handbook of agile software craftsmanship.',
        total_copies: 3,
        available_copies: 2,
      },
      {
        title: 'Design Patterns',
        author: 'Gang of Four',
        category: 'Software Engineering',
        isbn: '978-0201633610',
        description: 'Elements of Reusable Object-Oriented Software.',
        total_copies: 2,
        available_copies: 0,
      },
      {
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        category: 'Database',
        isbn: '978-0073523323',
        description: 'Comprehensive coverage of database system concepts.',
        total_copies: 4,
        available_copies: 4,
      },
    ];

    console.log('📚 Inserting sample books...');
    const { error: booksError } = await supabase
      .from('books')
      .insert(sampleBooks);

    if (booksError) {
      console.error('❌ Error inserting books:', booksError.message);
    } else {
      console.log('✅ Sample books inserted successfully');
    }

    // Create sample digital resources
    const sampleResources = [
      {
        title: 'Cloud Computing Fundamentals',
        description: 'An introduction to cloud computing concepts and architectures.',
        file_url: '/resources/cloud-computing.pdf',
        file_type: 'PDF',
        file_size: '2.5 MB',
        category: 'Cloud Computing',
        downloads: 45,
      },
      {
        title: 'Machine Learning Research Paper',
        description: 'Latest advances in deep learning algorithms.',
        file_url: '/resources/ml-research.pdf',
        file_type: 'PDF',
        file_size: '1.8 MB',
        category: 'Machine Learning',
        downloads: 32,
      },
      {
        title: 'Web Development Best Practices',
        description: 'Guide to modern web development techniques.',
        file_url: '/resources/webdev.pdf',
        file_type: 'PDF',
        file_size: '3.2 MB',
        category: 'Web Development',
        downloads: 67,
      },
    ];

    console.log('📄 Inserting sample digital resources...');
    const { error: resourcesError } = await supabase
      .from('digital_resources')
      .insert(sampleResources);

    if (resourcesError) {
      console.error('❌ Error inserting digital resources:', resourcesError.message);
    } else {
      console.log('✅ Sample digital resources inserted successfully');
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Register a new user account through the app');
    console.log('2. Run this SQL in your Supabase SQL Editor to make the user an admin:');
    console.log('');
    console.log('   UPDATE user_profiles');
    console.log('   SET role = \'admin\'');
    console.log('   WHERE email = \'your-email@example.com\';');
    console.log('');
    console.log('3. You can now log in and start using the system!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

main();