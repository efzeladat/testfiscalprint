# -*- coding: utf-8 -*-
{
    'name': "Fiscal Printer",

    'summary': """Download xml receipt for Venezuela Fiscal Printer""",

    'description': "",

    'author': "Esteban Zelada",
    'website': "https://www.innovati.cl",

    'category': 'Sales/Point of Sale',
    'version': '14.0.1',

    'depends': ['point_of_sale', 'base', 'web'],

    'data': [
        'views/ReceiptScreenFiscal.xml'
    ],
    'qweb': [
        'static/src/xml/ReceiptScreenFiscal.xml'
    ]
}
