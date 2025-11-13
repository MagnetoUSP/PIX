import mercadopago from "mercadopago";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { valor, descricao, email } = req.body;

    // Configuração do Mercado Pago
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    const pagamento = {
      transaction_amount: Number(valor),
      payment_method_id: "pix",
      description: descricao || "Pagamento ESP32",
      payer: {
        email: email || "pagador@teste.com",
        first_name: "ESP",
        last_name: "32",
        identification: {
          type: "CPF",
          number: "12345678909"
        }
      }
    };

    const resultado = await mercadopago.payment.create(pagamento);
    const pix = resultado.body.point_of_interaction.transaction_data;

    return res.status(200).json({
      status: "OK",
      payment_id: resultado.body.id,
      qr_code_texto: pix.qr_code,
      qr_code_base64: pix.qr_code_base64
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ error: erro.toString() });
  }
}
