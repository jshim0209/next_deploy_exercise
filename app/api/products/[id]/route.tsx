import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import schema from "../../products/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found!" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const optionalProduct = await prisma.product.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!optionalProduct) {
    return NextResponse.json({ error: "Product not found!" }, { status: 404 });
  }

  const productUpdated = await prisma.product.update({
    where: { id: optionalProduct.id },
    data: {
      name: body.name,
      price: body.price,
    },
  });
  return NextResponse.json(productUpdated, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const optionalProduct = await prisma.product.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  if (!optionalProduct) {
    return NextResponse.json({ error: "Product not found!" }, { status: 404 });
  }
  await prisma.product.delete({
    where: {
      id: optionalProduct.id,
    },
  });
  return NextResponse.json({});
}
