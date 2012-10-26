/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
package org.xwiki.localization.internal.message;

import java.util.Collection;
import java.util.Locale;

import org.xwiki.localization.Bundle;
import org.xwiki.rendering.block.Block;

/**
 * A static {@link Block} returned as it is without any modification.
 * 
 * @version $Id$
 * @since 4.3M2
 */
public class BlockTranslationMessageElement implements TranslationMessageElement
{
    /**
     * The {@link Block} to return.
     */
    private Block block;

    /**
     * @param block the {@link Block} to return
     */
    public BlockTranslationMessageElement(Block block)
    {
        this.block = block;
    }

    @Override
    public Block render(Locale locale, Collection<Bundle> bundles, Object... parameters)
    {
        return this.block;
    }
}
