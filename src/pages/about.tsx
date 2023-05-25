import React, { useState } from 'react'
import { Container } from '@chakra-ui/react'
// eslint-disable-next-line import/no-internal-modules
import ReactFileMarkdown from './components/Markdown/ReactFileMarkdown'
// eslint-disable-next-line import/no-internal-modules
import ReactMarkdown from 'react-markdown'

export default function About() {
  return (
    <>
      <Container>
        <ReactMarkdown>
          {'# About Us\n\nWelcome to our website, the premier destination for real-time data on Ethereum transactions and related metrics! We are a team of blockchain enthusiasts who are passionate about providing valuable insights to the crypto community.\n\n## Our Platform\n\nOur platform is designed to display the latest data on Ethereum transactions per second (TPS), block time, gas price, and more. We understand that in the fast-paced world of cryptocurrency, it\'s crucial to have access to accurate and up-to-date information, and that\'s exactly what we strive to provide.\n\n## Our Team\n\nOur team consists of experienced developers, data scientists, and blockchain experts who are dedicated to ensuring that our platform delivers the most reliable and accurate data possible. We use advanced algorithms and cutting-edge technology to process and display data in real-time, so you can make informed decisions about your investments.\n\n## Join Us\n\nWhether you\'re a seasoned trader or just getting started in the world of cryptocurrency, our platform has everything you need to stay on top of the latest trends and make informed decisions. From our easy-to-use interface to our comprehensive data sets, we\'ve got you covered.\n\nSo why wait?'}
        </ReactMarkdown>
      </Container>
    </>
  )
}
